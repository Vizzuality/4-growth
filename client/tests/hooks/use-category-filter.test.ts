import { renderHook, act } from "@testing-library/react-hooks";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useQueryState } from "nuqs";
import { usePathname } from "next/navigation";
import useProjectionsCategoryFilter from "@/hooks/use-category-filter";

vi.mock("nuqs", () => ({
  useQueryState: vi.fn(),
}));

vi.mock("@shared/dto/global/search-widget-data-params", () => ({
  VALID_SEARCH_WIDGET_DATA_OPERATORS: ["=", "!="],
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

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

  it("clears technology and technology-type when the operation area changes", () => {
    vi.mocked(useQueryState).mockReturnValue([
      "filters[0][name]=category&filters[0][operator]==&filters[0][values][0]=Agriculture&filters[1][name]=technology-type&filters[1][operator]==&filters[1][values][0]=Hardware&filters[2][name]=technology&filters[2][operator]==&filters[2][values][0]=Robotics",
      mockSetFiltersQuery,
    ]);

    const { result } = renderHook(() => useProjectionsCategoryFilter());

    act(() => {
      result.current.toggleCategory("Forestry");
    });

    const serialized = mockSetFiltersQuery.mock.calls[0][0] as string;
    expect(serialized).toContain("category");
    expect(serialized).toContain("Forestry");
    expect(serialized).not.toContain("technology-type");
    expect(serialized).not.toContain("technology");
  });

  it("switches to the new category while keeping unrelated filters", () => {
    vi.mocked(useQueryState).mockReturnValue([
      "filters[0][name]=category&filters[0][operator]==&filters[0][values][0]=Agriculture&filters[1][name]=country&filters[1][operator]==&filters[1][values][0]=Spain",
      mockSetFiltersQuery,
    ]);

    const { result } = renderHook(() => useProjectionsCategoryFilter());

    act(() => {
      result.current.toggleCategory("Forestry");
    });

    const serialized = mockSetFiltersQuery.mock.calls[0][0] as string;
    expect(serialized).toContain("Forestry");
    expect(serialized).toContain("country");
    expect(serialized).toContain("Spain");
  });
});
