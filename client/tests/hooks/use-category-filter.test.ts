import { renderHook, act } from "@testing-library/react-hooks";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useQueryState } from "nuqs";
import { usePathname } from "next/navigation";
import qs from "qs";
import useProjectionsCategoryFilter from "@/hooks/use-category-filter";
import type { FilterQueryParam } from "@/hooks/use-filters";

vi.mock("nuqs", () => ({
  useQueryState: vi.fn(),
}));

vi.mock("@shared/dto/global/search-widget-data-params", () => ({
  VALID_SEARCH_WIDGET_DATA_OPERATORS: ["=", "!="],
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const parseFilters = (serialized: string): Record<string, string[]> => {
  const { filters } = qs.parse(serialized) as unknown as {
    filters: FilterQueryParam[];
  };

  return Object.fromEntries(filters.map((f) => [f.name, f.values]));
};

describe("useProjectionsCategoryFilter", () => {
  const mockSetFiltersQuery = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(usePathname).mockReturnValue("/projections");
  });

  it("reports no category when none is in the URL", () => {
    vi.mocked(useQueryState).mockReturnValue(["", mockSetFiltersQuery]);

    const { result } = renderHook(() => useProjectionsCategoryFilter());

    expect(result.current.isCategorySelected).toBe(false);
    expect(result.current.selectedCategories).toEqual([]);
  });

  it("reads the selected category from the URL", () => {
    vi.mocked(useQueryState).mockReturnValue([
      "filters[0][name]=category&filters[0][operator]==&filters[0][values][0]=Agriculture",
      mockSetFiltersQuery,
    ]);

    const { result } = renderHook(() => useProjectionsCategoryFilter());

    expect(result.current.isCategorySelected).toBe(true);
    expect(result.current.selectedCategories).toEqual(["Agriculture"]);
  });

  it("drops the category-scoped filters and keeps the rest when the operation area changes", () => {
    vi.mocked(useQueryState).mockReturnValue([
      "filters[0][name]=category&filters[0][operator]==&filters[0][values][0]=Agriculture&filters[1][name]=technology-type&filters[1][operator]==&filters[1][values][0]=Hardware&filters[2][name]=technology&filters[2][operator]==&filters[2][values][0]=Robotics&filters[3][name]=country&filters[3][operator]==&filters[3][values][0]=Spain",
      mockSetFiltersQuery,
    ]);

    const { result } = renderHook(() => useProjectionsCategoryFilter());

    act(() => {
      result.current.toggleCategory("Forestry");
    });

    expect(parseFilters(mockSetFiltersQuery.mock.calls[0][0])).toEqual({
      country: ["Spain"],
      category: ["Forestry"],
    });
  });

  it("keeps the technology filters when the selected operation area is picked again", () => {
    vi.mocked(useQueryState).mockReturnValue([
      "filters[0][name]=category&filters[0][operator]==&filters[0][values][0]=Agriculture&filters[1][name]=technology&filters[1][operator]==&filters[1][values][0]=Robotics",
      mockSetFiltersQuery,
    ]);

    const { result } = renderHook(() => useProjectionsCategoryFilter());

    act(() => {
      result.current.toggleCategory("Agriculture");
    });

    expect(mockSetFiltersQuery).not.toHaveBeenCalled();
  });
});
