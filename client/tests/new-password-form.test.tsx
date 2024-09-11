import React from "react";

import { useRouter, useParams } from "next/navigation";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { client } from "@/lib/queryClient";

import NewPasswordForm from "@/containers/auth/forgot-password/new-password-form";

import { useApiResponseToast } from "@/components/ui/use-api-response-toast";

// Mocks
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useParams: vi.fn(),
}));
vi.mock("@/components/ui/use-api-response-toast", () => ({
  useApiResponseToast: vi.fn(),
}));

vi.mock("@/lib/queryClient", () => ({
  client: {
    user: {
      resetPassword: {
        mutation: vi.fn(),
      },
    },
  },
}));

describe("NewPasswordForm", () => {
  const mockPush = vi.fn();
  const mockApiResponseToast = vi.fn();
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as never);
    vi.mocked(useParams).mockReturnValue({ token: "mockToken" });
    vi.mocked(useApiResponseToast).mockReturnValue({
      apiResponseToast: mockApiResponseToast,
      toast: mockToast,
    });
    vi.mocked(client.users.resetPassword.mutation).mockClear();
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
    vi.mocked(client.users.resetPassword.mutation).mockResolvedValueOnce({
      status: 200,
    } as never);

    render(<NewPasswordForm />);

    fireEvent.input(screen.getAllByPlaceholderText("*******")[0], {
      target: { value: "password123" },
    });
    fireEvent.input(screen.getAllByPlaceholderText("*******")[1], {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByText("Submit"));

    await waitFor(() => {
      expect(client.users.resetPassword.mutation).toHaveBeenCalledWith({
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
    vi.mocked(client.users.resetPassword.mutation).mockRejectedValueOnce(
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
