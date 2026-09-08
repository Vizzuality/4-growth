import { PageFilter } from "@shared/dto/widgets/page-filter.entity";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DATA_SOURCE_FILTER_NAME } from "@/lib/constants";

import { FilterRowButton } from "@/containers/filter/filter-row";

const dataSourceFilter = [
  { name: DATA_SOURCE_FILTER_NAME, label: "Data source", values: [] },
] as unknown as PageFilter[];

describe("FilterRowButton", () => {
  it("names both sources separately when they are compared, so the row doubles as the legend", () => {
    render(
      <FilterRowButton
        name={DATA_SOURCE_FILTER_NAME}
        filters={dataSourceFilter}
        selectedFilter={{
          name: DATA_SOURCE_FILTER_NAME,
          operator: "=",
          values: ["survey", "automated"],
        }}
        locked={false}
        reasonId="reason"
        label={{ selected: "Data is", unSelected: "Data is" }}
        onRemoveFilterValue={vi.fn()}
      />,
    );

    expect(screen.getByText("Survey")).toBeInTheDocument();
    expect(screen.getByText("Automated")).toBeInTheDocument();
    expect(screen.queryByText("Survey and Automated")).not.toBeInTheDocument();
  });

  it("falls back to the combined option label for a single source", () => {
    render(
      <FilterRowButton
        name={DATA_SOURCE_FILTER_NAME}
        filters={dataSourceFilter}
        selectedFilter={{
          name: DATA_SOURCE_FILTER_NAME,
          operator: "=",
          values: ["survey"],
        }}
        locked={false}
        reasonId="reason"
        label={{ selected: "Data is", unSelected: "Data is" }}
        onRemoveFilterValue={vi.fn()}
      />,
    );

    expect(screen.getByText("Survey responses")).toBeInTheDocument();
  });
});
