import { renderHook, act } from "@testing-library/react-hooks";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useQueryState } from "nuqs";
import useFilters from "@/hooks/use-filters";
import type { MockInstance } from "vitest";

vi.mock("nuqs", () => ({
  useQueryState: vi.fn(),
}));

vi.mock("@shared/dto/global/search-widget-data-params", () => ({
  VALID_SEARCH_WIDGET_DATA_OPERATORS: ["=", "!="],
}));

describe("useFilters", () => {
  let consoleErrorSpy: MockInstance<typeof console.error>;

  beforeEach(() => {
    vi.resetAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should return empty filters when filtersQuery is empty", () => {
    const mockSetFiltersQuery = vi.fn();
    (useQueryState as jest.Mock).mockReturnValue(["", mockSetFiltersQuery]);

    const { result } = renderHook(() => useFilters());

    expect(result.current.filters).toEqual([]);
  });

  it("should parse and validate filters from filtersQuery", () => {
    const validFiltersQuery =
      "filters[0][name]=sector&filters[0][operator]==&filters[0][values][0]=value1";
    const mockSetFiltersQuery = vi.fn();
    (useQueryState as jest.Mock).mockReturnValue([
      validFiltersQuery,
      mockSetFiltersQuery,
    ]);

    const { result } = renderHook(() => useFilters());

    expect(result.current.filters).toEqual([
      { name: "sector", operator: "=", values: ["value1"] },
    ]);
  });

  it("should set new filters correctly", () => {
    const mockSetFiltersQuery = vi.fn();
    (useQueryState as jest.Mock).mockReturnValue(["", mockSetFiltersQuery]);

    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setFilters([
        { name: "sector", operator: "=", values: ["newValue"] },
      ]);
    });

    expect(mockSetFiltersQuery).toHaveBeenCalledWith(
      "filters[0][name]=sector&filters[0][operator]==&filters[0][values][0]=newValue",
    );
  });

  const testInvalidFilter = (
    description: string,
    invalidFiltersQuery: string,
    expectedErrorMessage: string,
  ) => {
    it(`should handle ${description}`, () => {
      const mockSetFiltersQuery = vi.fn();
      vi.mocked(useQueryState).mockReturnValue([
        invalidFiltersQuery,
        mockSetFiltersQuery,
      ]);

      const { result } = renderHook(() => useFilters());

      expect(result.current.filters).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error parsing filters:",
        expect.any(Error),
      );

      const errorArr = consoleErrorSpy.mock.calls.find((arr) =>
        arr.includes("Error parsing filters:"),
      );

      if (!errorArr) {
        throw new Error(
          "Expected error 'Error parsing filters:' was not logged",
        );
      }

      const errorMessage = (errorArr[1] as Error).message;
      expect(errorMessage).toContain(expectedErrorMessage);
    });
  };

  testInvalidFilter(
    "invalid param",
    "filters=justAString",
    "Filters must be an array",
  );

  testInvalidFilter(
    "invalid operator",
    "filters[0][name]=sector&filters[0][operator]=>&filters[0][values][]=value1",
    "Filter at index 0 has invalid 'operator': \">\"",
  );

  testInvalidFilter(
    "missing name",
    "filters[0][operator]==&filters[0][values][]=value1",
    "Filter at index 0 is missing required keys: name",
  );

  testInvalidFilter(
    "missing operator",
    "filters[0][name]=sector&filters[0][values][]=value1",
    "Filter at index 0 is missing required keys: operator",
  );

  testInvalidFilter(
    "missing values",
    "filters[0][name]=sector&filters[0][operator]==",
    "Filter at index 0 is missing required keys: values",
  );

  testInvalidFilter(
    "empty values array",
    "filters[0][name]=sector&filters[0][operator]==&filters[0][values]=",
    "Filter at index 0 has invalid 'values': expected a non-empty array",
  );
});
