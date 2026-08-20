import { renderHook, act } from "@testing-library/react-hooks";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useQueryState } from "nuqs";
import useFilters from "@/hooks/use-filters";
import type { MockInstance } from "vitest";
import { usePathname } from "next/navigation";

vi.mock("nuqs", () => ({
  useQueryState: vi.fn(),
}));

vi.mock("@shared/dto/global/search-widget-data-params", () => ({
  VALID_SEARCH_WIDGET_DATA_OPERATORS: ["=", "!="],
}));

vi.mock("next/navigation", () => {
  return {
    usePathname: vi.fn(),
  };
});

describe("useFilters", () => {
  let consoleErrorSpy: MockInstance<typeof console.error>;

  beforeEach(() => {
    vi.resetAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (usePathname as jest.Mock | ReturnType<typeof vi.fn>).mockReturnValue("/");
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should return no filters when filtersQuery is empty", () => {
    const mockSetFiltersQuery = vi.fn();
    (useQueryState as jest.Mock).mockReturnValue(["", mockSetFiltersQuery]);

    const { result } = renderHook(() => useFilters());

    expect(result.current.filters).toEqual([]);
  });

  it("should return default scenario filter when filtersQuery is empty and pathname is /projections", () => {
    const mockSetFiltersQuery = vi.fn();
    vi.mocked(useQueryState).mockReturnValue(["", mockSetFiltersQuery]);
    vi.mocked(usePathname).mockReturnValue("/projections");

    const { result } = renderHook(() => useFilters());

    expect(result.current.filters).toEqual([
      {
        name: "scenario",
        operator: "=",
        values: ["baseline"],
      },
    ]);
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
      "filters[0][name]=sector&filters[0][operator]=%3D&filters[0][values][0]=newValue",
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

  describe("data source default", () => {
    const SURVEY_DATA_SOURCE = {
      name: "data-source",
      operator: "=",
      values: ["survey"],
    };

    const mockSetFiltersQuery = vi.fn();

    beforeEach(() => {
      vi.mocked(useQueryState).mockReturnValue(["", mockSetFiltersQuery]);
      vi.mocked(usePathname).mockReturnValue("/survey-analysis");
    });

    it.each(["/survey-analysis", "/survey-analysis/sandbox"])(
      "seeds the survey data source on %s when there is no filters query",
      (pathname) => {
        vi.mocked(usePathname).mockReturnValue(pathname);

        const { result } = renderHook(() => useFilters());

        expect(result.current.filters).toEqual([SURVEY_DATA_SOURCE]);
      },
    );

    it("merges the data source default into a filters query that omits it", () => {
      vi.mocked(useQueryState).mockReturnValue([
        "filters[0][name]=sector&filters[0][operator]==&filters[0][values][0]=Retail",
        mockSetFiltersQuery,
      ]);

      const { result } = renderHook(() => useFilters());

      expect(result.current.filters).toEqual([
        SURVEY_DATA_SOURCE,
        { name: "sector", operator: "=", values: ["Retail"] },
      ]);
    });

    it("preserves an explicitly selected data source", () => {
      vi.mocked(useQueryState).mockReturnValue([
        "filters[0][name]=data-source&filters[0][operator]==&filters[0][values][0]=survey&filters[0][values][1]=automated",
        mockSetFiltersQuery,
      ]);

      const { result } = renderHook(() => useFilters());

      expect(result.current.filters).toContainEqual({
        name: "data-source",
        operator: "=",
        values: ["survey", "automated"],
      });
    });

    it("never applies the data source default on projections", () => {
      vi.mocked(usePathname).mockReturnValue("/projections");
      vi.mocked(useQueryState).mockReturnValue([
        "filters[0][name]=country&filters[0][operator]==&filters[0][values][0]=Spain",
        mockSetFiltersQuery,
      ]);

      const { result } = renderHook(() => useFilters());

      expect(result.current.filters).toEqual([
        { name: "country", operator: "=", values: ["Spain"] },
      ]);
    });

    it("keeps the chosen data source when clearing all filters", () => {
      vi.mocked(useQueryState).mockReturnValue([
        "filters[0][name]=data-source&filters[0][operator]==&filters[0][values][0]=automated&filters[1][name]=sector&filters[1][operator]==&filters[1][values][0]=Retail",
        mockSetFiltersQuery,
      ]);

      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.removeAll();
      });

      expect(mockSetFiltersQuery).toHaveBeenCalledWith(
        "filters[0][name]=data-source&filters[0][operator]=%3D&filters[0][values][0]=automated",
      );
    });
  });

  describe("forestry lock", () => {
    const FORESTRY_SECTOR = {
      name: "sector",
      operator: "=",
      values: ["Forestry"],
    };

    const mockSetFiltersQuery = vi.fn();

    beforeEach(() => {
      vi.mocked(usePathname).mockReturnValue("/survey-analysis");
    });

    it("overwrites a conflicting sector when the data source is automated", () => {
      vi.mocked(useQueryState).mockReturnValue([
        "filters[0][name]=data-source&filters[0][operator]==&filters[0][values][0]=automated&filters[1][name]=sector&filters[1][operator]==&filters[1][values][0]=Agriculture",
        mockSetFiltersQuery,
      ]);

      const { result } = renderHook(() => useFilters());

      expect(result.current.filters).toEqual([
        { name: "data-source", operator: "=", values: ["automated"] },
        FORESTRY_SECTOR,
      ]);
    });

    it("locks the sector in comparison mode so both sources share a population", () => {
      vi.mocked(useQueryState).mockReturnValue([
        "filters[0][name]=data-source&filters[0][operator]==&filters[0][values][0]=survey&filters[0][values][1]=automated&filters[1][name]=sector&filters[1][operator]==&filters[1][values][0]=Agriculture",
        mockSetFiltersQuery,
      ]);

      const { result } = renderHook(() => useFilters());

      expect(result.current.filters).toContainEqual(FORESTRY_SECTOR);
    });

    it("adds the locked sector when the query has none", () => {
      vi.mocked(useQueryState).mockReturnValue([
        "filters[0][name]=data-source&filters[0][operator]==&filters[0][values][0]=automated",
        mockSetFiltersQuery,
      ]);

      const { result } = renderHook(() => useFilters());

      expect(result.current.filters).toContainEqual(FORESTRY_SECTOR);
    });

    it("leaves the sector alone for survey-only data", () => {
      vi.mocked(useQueryState).mockReturnValue([
        "filters[0][name]=data-source&filters[0][operator]==&filters[0][values][0]=survey&filters[1][name]=sector&filters[1][operator]==&filters[1][values][0]=Agriculture",
        mockSetFiltersQuery,
      ]);

      const { result } = renderHook(() => useFilters());

      expect(result.current.filters).toContainEqual({
        name: "sector",
        operator: "=",
        values: ["Agriculture"],
      });
    });
  });
});
