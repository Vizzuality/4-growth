import { act } from "react";

import { renderHook } from "@testing-library/react-hooks";

import { useApiResponseToast } from "@/components/ui/use-api-response-toast";

// Mocks the useToast hook that is used in useApiResponseToast
jest.mock("../src/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe("useApiResponseToast", () => {
  it("shows a success toast for 2xx response", async () => {
    const response = { status: 200 };
    const options = { successMessage: "Success!" };
    const { result } = renderHook(() => useApiResponseToast());

    act(() => {
      result.current.apiResponseToast(response, options);
    });

    expect(result.current.toast).toHaveBeenCalledWith({
      description: options.successMessage,
    });
  });

  it("shows a custom error toast for 4xx response with custom error message", async () => {
    const response = { status: 400 };
    const options = {
      successMessage: "Success!",
      customErrorMessage: "Custom error message",
    };
    const { result } = renderHook(() => useApiResponseToast());

    act(() => {
      result.current.apiResponseToast(response, options);
    });

    expect(result.current.toast).toHaveBeenCalledWith({
      variant: "destructive",
      description: options.customErrorMessage,
    });
  });

  it("shows error titles for 4xx response without custom error message", async () => {
    const response = {
      status: 400,
      body: { errors: [{ title: "Error 1" }, { title: "Error 2" }] },
    };
    const options = { successMessage: "Success!" };
    const { result } = renderHook(() => useApiResponseToast());

    act(() => {
      result.current.apiResponseToast(response, options);
    });

    expect(result.current.toast).toHaveBeenCalledWith({
      description: "Error 1",
    });
    expect(result.current.toast).toHaveBeenCalledWith({
      description: "Error 2",
    });
  });

  it("shows a default error toast for 5xx response", async () => {
    const response = { status: 500 };
    const options = { successMessage: "Success!" };
    const { result } = renderHook(() => useApiResponseToast());

    act(() => {
      result.current.apiResponseToast(response, options);
    });

    expect(result.current.toast).toHaveBeenCalledWith({
      variant: "destructive",
      description: "Something went wrong. Please try again.",
    });
  });
});
