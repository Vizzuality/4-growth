import React from "react";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom/extend-expect";
import { useApiResponseToast } from "@/components/ui/use-api-response-toast";

/**
 * @description: We create a mock test wrapper for the component since react-hooks package for testing library throws several deprecation warnings.
 */

const TestComponent = ({ response, options }) => {
  const { apiResponseToast } = useApiResponseToast();

  return (
    <button onClick={() => apiResponseToast(response, options)}>
      Trigger Toast
    </button>
  );
};

import { useToast } from "@/components/ui/use-toast";

jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn(),
}));

describe("useApiResponseToast", () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useToast.mockReturnValue({ toast: mockToast });
  });

  it("shows a success toast for 2xx response", async () => {
    const response = { status: 200 };
    const options = { successMessage: "Success!" };
    render(<TestComponent response={response} options={options} />);

    fireEvent.click(screen.getByText("Trigger Toast"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        description: options.successMessage,
      });
    });
  });

  it("shows a custom error toast for 4xx response with custom error message", async () => {
    const response = { status: 400 };
    const options = {
      successMessage: "Success!",
      customErrorMessage: "Custom error message",
    };
    render(<TestComponent response={response} options={options} />);

    fireEvent.click(screen.getByText("Trigger Toast"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        description: options.customErrorMessage,
      });
    });
  });

  it("shows error titles for 4xx response without custom error message", async () => {
    const response = {
      status: 400,
      body: { errors: [{ title: "Error 1" }, { title: "Error 2" }] },
    };
    const options = { successMessage: "Success!" };
    render(<TestComponent response={response} options={options} />);

    fireEvent.click(screen.getByText("Trigger Toast"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        description: "Error 1",
      });
      expect(mockToast).toHaveBeenCalledWith({
        description: "Error 2",
      });
    });
  });

  it("shows a default error toast for 5xx response", async () => {
    const response = { status: 500 };
    const options = { successMessage: "Success!" };
    render(<TestComponent response={response} options={options} />);

    fireEvent.click(screen.getByText("Trigger Toast"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    });
  });
});
