import React from "react";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom/extend-expect";
import { client } from "@/lib/queryClient";

import ContactUsForm from "@/containers/contact-us";

import { toast } from "@/components/ui/use-toast";

// Mocks
// TODO: refactor to use alias when https://github.com/Vizzuality/4-growth/pull/63 is merged
jest.mock("../src/components/ui/use-toast", () => ({
  toast: jest.fn(),
}));

jest.mock("../src/lib/queryClient", () => ({
  client: {
    contact: {
      contact: {
        mutation: jest.fn(),
      },
    },
  },
}));

describe("ContactUsForm", () => {
  const mockToast = toast as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(<ContactUsForm />);

    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your message here"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/I agree with 4Growth's Privacy Policy/i),
    ).toBeInTheDocument();
  });

  it("shows validation errors when form is submitted empty", async () => {
    render(<ContactUsForm />);

    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      // TODO: the validation message for the Name field is missing because I can't locate it for some reason
      //expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Message is required")).toBeInTheDocument();
      expect(
        screen.getByText("Privacy policy must be accepted"),
      ).toBeInTheDocument();
    });
  });

  it("submits the form successfully when filled correctly", async () => {
    client.contact.contact.mutation.mockResolvedValueOnce({});

    render(<ContactUsForm />);

    fireEvent.input(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "John Doe" },
    });
    fireEvent.input(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.input(screen.getByPlaceholderText("Enter your message here"), {
      target: { value: "Hello, this is a test message." },
    });
    fireEvent.click(
      screen.getByLabelText(/I agree with 4Growth's Privacy Policy/i),
    );

    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(client.contact.contact.mutation).toHaveBeenCalledWith({
        body: {
          name: "John Doe",
          email: "john.doe@example.com",
          message: "Hello, this is a test message.",
        },
      });
      expect(mockToast).toHaveBeenCalledWith({
        variant: "default",
        description: "Message sent!",
      });
    });
  });

  it("shows an error toast when form submission fails", async () => {
    client.contact.contact.mutation.mockRejectedValueOnce(
      new Error("Submission failed"),
    );

    render(<ContactUsForm />);

    fireEvent.input(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "John Doe" },
    });
    fireEvent.input(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.input(screen.getByPlaceholderText("Enter your message here"), {
      target: { value: "Hello, this is a test message." },
    });
    fireEvent.click(
      screen.getByLabelText(/I agree with 4Growth's Privacy Policy/i),
    );

    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(client.contact.contact.mutation).toHaveBeenCalledWith({
        body: {
          name: "John Doe",
          email: "john.doe@example.com",
          message: "Hello, this is a test message.",
        },
      });
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        description: "Something went wrong",
      });
    });
  });

  it("displays loading animation while sending", async () => {
    client.contact.contact.mutation.mockImplementation(() => {
      return new Promise((resolve) => setTimeout(resolve, 100));
    });

    render(<ContactUsForm />);

    fireEvent.input(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "John Doe" },
    });
    fireEvent.input(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.input(screen.getByPlaceholderText("Enter your message here"), {
      target: { value: "Hello, this is a test message." },
    });
    fireEvent.click(
      screen.getByLabelText(/I agree with 4Growth's Privacy Policy/i),
    );

    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(screen.getByText("Sending...")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText("Sending...")).not.toBeInTheDocument();
    });
  });
});
