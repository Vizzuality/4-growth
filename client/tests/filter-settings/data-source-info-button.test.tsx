import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import FilterPopup from "@/containers/sidebar/filter-settings/filter-popup";

describe("Data source info button", () => {
  const renderFilterPopup = () =>
    render(
      <FilterPopup
        name="data-source"
        label={{ selected: "Data is", unSelected: "Data source" }}
        filters={[{ name: "data-source", label: "Data source", values: [] }]}
        filterQueryParams={[
          { name: "data-source", operator: "=", values: ["survey"] },
        ]}
        onAddFilter={vi.fn()}
        onRemoveFilterValue={vi.fn()}
      />,
    );

  it("opens the data sources dialog without opening the filter popover", async () => {
    renderFilterPopup();
    const filterTrigger = screen.getByRole("button", { name: /Data is/ });

    fireEvent.click(
      screen.getByRole("button", { name: "About the data sources" }),
    );

    expect(await screen.findByRole("dialog")).toHaveTextContent("Data sources");
    expect(filterTrigger).toHaveAttribute("aria-expanded", "false");
  });
});
