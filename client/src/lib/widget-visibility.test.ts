import { describe, expect, it } from "vitest";

import { getVisibleWidgets } from "@/lib/widget-visibility";

import { FilterQueryParam } from "@/hooks/use-filters";

import { TransformedWidget } from "@/types";

const dataSource = (...values: string[]): FilterQueryParam[] => [
  { name: "data-source", operator: "=", values },
];

const widget = (
  indicator: string,
  chart: { label: string; value: number; total: number }[],
) =>
  ({
    indicator,
    data: { raw: { chart }, percentages: { chart } },
  }) as TransformedWidget;

const AGRICULTURE = widget("technology-type-agriculture", [
  { label: "N/A", value: 121, total: 122 },
  { label: "Other namely", value: 1, total: 122 },
]);
const ALL_NA = widget("primary-area-of-operation-in-agriculture", [
  { label: "N/A", value: 122, total: 122 },
]);
const UNANSWERED = widget("tech-provider-agri-forestry-percentage", []);
const ANSWERED = widget("data-storage", [
  { label: "Cloud", value: 20, total: 20 },
]);

describe("getVisibleWidgets", () => {
  it("keeps every widget when the data source is survey only", () => {
    expect(
      getVisibleWidgets(
        [AGRICULTURE, ALL_NA, UNANSWERED, ANSWERED],
        dataSource("survey"),
      ),
    ).toEqual([AGRICULTURE, ALL_NA, UNANSWERED, ANSWERED]);
  });

  it("drops agriculture-only and unanswered widgets for automated data", () => {
    expect(
      getVisibleWidgets(
        [AGRICULTURE, ALL_NA, UNANSWERED, ANSWERED],
        dataSource("automated"),
      ),
    ).toEqual([ANSWERED]);
  });

  it("drops agriculture-only widgets when sources are combined, despite survey answers", () => {
    expect(
      getVisibleWidgets(
        [AGRICULTURE, ANSWERED],
        dataSource("survey", "automated"),
      ),
    ).toEqual([ANSWERED]);
  });
});
