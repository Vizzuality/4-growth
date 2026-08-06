import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import FilterPopup from "@/containers/sidebar/filter-settings/filter-popup";
import type { FilterQueryParam } from "@/hooks/use-filters";

describe("Sector filter locked to Forestry", () => {
  const onRemoveFilterValue = vi.fn();

  const renderSectorRow = (dataSource: string[], sector: string) => {
    const filterQueryParams: FilterQueryParam[] = [
      { name: "data-source", operator: "=", values: dataSource },
      { name: "sector", operator: "=", values: [sector] },
    ];

    return render(
      <FilterPopup
        name="sector"
        label={{ selected: "Sector", unSelected: "All operation areas" }}
        filters={[
          { name: "sector", label: "Sector", values: ["Agriculture", "Forestry"] },
        ]}
        filterQueryParams={filterQueryParams}
        onAddFilter={vi.fn()}
        onRemoveFilterValue={onRemoveFilterValue}
      />,
    );
  };

  it("cannot be opened or removed while the data source includes automated", () => {
    const { container } = renderSectorRow(["automated"], "Forestry");
    const trigger = screen.getByRole("button", { name: /Sector/ });

    expect(trigger).toHaveTextContent("Forestry");
    expect(trigger).toHaveAttribute("aria-disabled", "true");
    expect(trigger).toHaveAccessibleDescription(/forestry organisations only/i);
    expect(container.querySelector("svg")).toBeNull();

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("stays editable for survey-only data", () => {
    const { container } = renderSectorRow(["survey"], "Agriculture");
    const trigger = screen.getByRole("button", { name: /Sector/ });

    expect(trigger).not.toHaveAttribute("aria-disabled");
    expect(container.querySelector("svg")).not.toBeNull();

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
