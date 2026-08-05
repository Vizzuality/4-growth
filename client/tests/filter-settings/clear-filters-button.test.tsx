import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { useQueryState } from "nuqs";
import { usePathname } from "next/navigation";
import ClearFiltersButton from "@/containers/sidebar/filter-settings/clear-filters-button";

vi.mock("nuqs", () => ({
  useQueryState: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("ClearFiltersButton", () => {
  const mockSetFiltersQuery = vi.fn();

  const renderWithQuery = (filtersQuery: string) => {
    vi.mocked(useQueryState).mockReturnValue([
      filtersQuery,
      mockSetFiltersQuery,
    ]);
    render(<ClearFiltersButton />);
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(usePathname).mockReturnValue("/survey-analysis");
  });

  it("stays hidden when the data source is the only active filter", () => {
    renderWithQuery("");

    expect(screen.queryByText("Clear all")).not.toBeInTheDocument();
  });

  it("stays hidden when an explicit data source is the only active filter", () => {
    renderWithQuery(
      "filters[0][name]=data-source&filters[0][operator]==&filters[0][values][0]=automated",
    );

    expect(screen.queryByText("Clear all")).not.toBeInTheDocument();
  });

  it("appears when a clearable filter sits alongside the data source", () => {
    renderWithQuery(
      "filters[0][name]=data-source&filters[0][operator]==&filters[0][values][0]=survey&filters[1][name]=sector&filters[1][operator]==&filters[1][values][0]=Retail",
    );

    expect(screen.getByText("Clear all")).toBeInTheDocument();
  });
});
