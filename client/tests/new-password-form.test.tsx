import React from "react";

import { useRouter, useParams } from "next/navigation";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { client } from "@/lib/queryClient";

import NewPasswordForm from "@/containers/auth/forgot-password/new-password-form";

import { useApiResponseToast } from "@/components/ui/use-api-response-toast";

// Mocks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock("../src/components/ui/use-api-response-toast", () => ({
  useApiResponseToast: jest.fn(),
}));

jest.mock("../src/lib/queryClient", () => ({
  client: {
    user: {
      resetPassword: {
        mutation: jest.fn(),
      },
    },
  },
}));

describe("NewPasswordForm", () => {
  const mockPush = jest.fn();
  const mockApiResponseToast = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
    useParams.mockReturnValue({ token: "mockToken" });
    useApiResponseToast.mockReturnValue({
      apiResponseToast: mockApiResponseToast,
      toast: mockToast,
    });
    client.user.resetPassword.mutation.mockClear();
    mockPush.mockClear();
    mockApiResponseToast.mockClear();
    mockToast.mockClear();
  });

  it("renders the form correctly", () => {
    render(<NewPasswordForm />);

    expect(screen.getByText("Create new password")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("shows validation error when passwords do not match", async () => {
    render(<NewPasswordForm />);

    fireEvent.input(screen.getAllByPlaceholderText("*******")[0], {
      target: { value: "password123" },
    });
    fireEvent.input(screen.getAllByPlaceholderText("*******")[1], {
      target: { value: "differentPassword" },
    });

    fireEvent.submit(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText(/Passwords must match/i)).toBeInTheDocument();
    });
  });

  it("does not show validation error when passwords match", async () => {
    render(<NewPasswordForm />);

    fireEvent.input(screen.getAllByPlaceholderText("*******")[0], {
      target: { value: "password123" },
    });
    fireEvent.input(screen.getAllByPlaceholderText("*******")[1], {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByText("Submit"));

    await waitFor(() => {
      expect(
        screen.queryByText(/Passwords must match/i),
      ).not.toBeInTheDocument();
    });
  });

  it("submits form successfully with matching passwords", async () => {
    client.user.resetPassword.mutation.mockResolvedValueOnce({ status: 200 });

    render(<NewPasswordForm />);

    fireEvent.input(screen.getAllByPlaceholderText("*******")[0], {
      target: { value: "password123" },
    });
    fireEvent.input(screen.getAllByPlaceholderText("*******")[1], {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByText("Submit"));

    await waitFor(() => {
      expect(client.user.resetPassword.mutation).toHaveBeenCalledWith({
        body: { password: "password123", repeatPassword: "password123" },
        extraHeaders: { Authorization: "Bearer mockToken" },
      });
    });

    expect(mockApiResponseToast).toHaveBeenCalledWith(
      { status: 200 },
      { successMessage: "Password changed successfully." },
    );
    expect(mockPush).toHaveBeenCalledWith("/auth/signin");
  });

  it("shows an error toast when submission fails", async () => {
    client.user.resetPassword.mutation.mockRejectedValueOnce(
      new Error("Error"),
    );

    render(<NewPasswordForm />);

    fireEvent.input(screen.getAllByPlaceholderText("*******")[0], {
      target: { value: "password123" },
    });
    fireEvent.input(screen.getAllByPlaceholderText("*******")[1], {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByText("Submit"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        description: "Something went wrong",
      });
    });
  });

  it("toggles password visibility", async () => {
    render(<NewPasswordForm />);

    const toggleButtons = screen.getAllByRole("button");

    // Initial state is password hidden
    expect(screen.getAllByPlaceholderText("*******")[0]).toHaveAttribute(
      "type",
      "password",
    );

    // Click to show password
    fireEvent.click(toggleButtons[0]);
    expect(screen.getAllByPlaceholderText("*******")[0]).toHaveAttribute(
      "type",
      "text",
    );

    // Click to hide password again
    fireEvent.click(toggleButtons[0]);
    expect(screen.getAllByPlaceholderText("*******")[0]).toHaveAttribute(
      "type",
      "password",
    );
  });
});
