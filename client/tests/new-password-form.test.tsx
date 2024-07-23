import React from "react";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom/extend-expect";

import NewPasswordForm from "@/containers/auth/forgot-password/new-password-form";

describe("NewPasswordForm", () => {
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

    await waitFor(async () => {
      expect(
        await screen.findByText(/Passwords must match/i),
      ).toBeInTheDocument();
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
        screen.queryByText("Passwords must match"),
      ).not.toBeInTheDocument();
    });
  });

  it("submits form successfully with matching passwords", async () => {
    render(<NewPasswordForm />);

    fireEvent.input(screen.getAllByPlaceholderText("*******")[0], {
      target: { value: "password123" },
    });
    fireEvent.input(screen.getAllByPlaceholderText("*******")[1], {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByText("Submit"));

    // TODO: test that the client has been called with the correct arguments
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
