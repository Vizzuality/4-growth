import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { client } from "@/lib/queryClient";

import ForgotPasswordEmailForm from "@/containers/auth/forgot-password/email-form";

import { useApiResponseToast } from "@/components/ui/use-api-response-toast";

// Mocks
jest.mock("../src/lib/queryClient", () => ({
  client: {
    auth: {
      recoverPassword: {
        mutation: jest.fn(),
      },
    },
  },
}));

jest.mock("../src/components/ui/use-api-response-toast", () => ({
  useApiResponseToast: jest.fn(() => ({
    apiResponseToast: jest.fn(),
    toast: jest.fn(),
  })),
}));

describe("ForgotPasswordEmailForm", () => {
  it("renders the form correctly", () => {
    render(<ForgotPasswordEmailForm />);

    expect(screen.getByText("Reset your password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByText("Send link")).toBeInTheDocument();
  });

  it("shows validation error when email is not provided", async () => {
    render(<ForgotPasswordEmailForm />);

    fireEvent.click(screen.getByText("Send link"));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });

  it("calls apiResponseToast on successful response", async () => {
    const mockResponse = { status: 200 };
    client.auth.recoverPassword.mutation.mockResolvedValue(mockResponse);
    const mockApiResponseToast = jest.fn();
    useApiResponseToast.mockReturnValue({
      apiResponseToast: mockApiResponseToast,
      toast: jest.fn(),
    });

    render(<ForgotPasswordEmailForm />);

    fireEvent.input(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.submit(screen.getByText("Send link"));

    await waitFor(() => {
      expect(mockApiResponseToast).toHaveBeenCalledWith(mockResponse, {
        successMessage: "Check your inbox for a password reset link.",
      });
    });
  });

  it("shows error toast on failed response", async () => {
    client.auth.recoverPassword.mutation.mockRejectedValue(
      new Error("Network error"),
    );
    const mockToast = jest.fn();
    useApiResponseToast.mockReturnValue({
      apiResponseToast: jest.fn(),
      toast: mockToast,
    });

    render(<ForgotPasswordEmailForm />);

    fireEvent.input(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.submit(screen.getByText("Send link"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        description: "Something went wrong",
      });
    });
  });
});
