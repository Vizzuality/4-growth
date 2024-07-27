import React from "react";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom/extend-expect";
import { client } from "@/lib/queryClient";

import ContactUsForm from "@/containers/contact-us";

// Mocks
jest.mock("@/lib/queryClient", () => ({
  client: {
    contact: {
      contact: {
        mutation: jest.fn(),
      },
    },
  },
}));

const mockApiResponseToast = jest.fn();
const mockToast = jest.fn();

jest.mock("@/components/ui/use-api-response-toast", () => ({
  useApiResponseToast: jest.fn(() => ({
    apiResponseToast: mockApiResponseToast,
    toast: mockToast,
  })),
}));

describe("ContactUsForm", () => {
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
      // TODO: Missing validation for Name field, not able to locate the element
      // expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Message is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Privacy policy must be accepted/i),
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
      expect(mockApiResponseToast).toHaveBeenCalledTimes(1);
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
