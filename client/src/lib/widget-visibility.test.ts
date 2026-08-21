import { describe, expect, it } from "vitest";

import {
  getEmptySectionSlugs,
  getVisibleWidgets,
} from "@/lib/widget-visibility";

import { FilterQueryParam } from "@/hooks/use-filters";

import { TransformedSection, TransformedWidget } from "@/types";

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

const section = (
  order: number,
  slug: string,
  baseWidgets: TransformedWidget[],
) => ({ order, slug, baseWidgets }) as TransformedSection;

describe("getEmptySectionSlugs", () => {
  const SECTIONS = [
    section(1, "overview", [UNANSWERED]),
    section(2, "general-information", [UNANSWERED, ANSWERED]),
    section(3, "technology-providers", [UNANSWERED]),
    section(4, "future-outlook", [AGRICULTURE, ALL_NA]),
  ];

  it("hides nothing when the data source is survey only", () => {
    expect(getEmptySectionSlugs(SECTIONS, dataSource("survey"))).toEqual(
      new Set(),
    );
  });

  it("collects only the sections left with no widget for automated data", () => {
    expect(getEmptySectionSlugs(SECTIONS, dataSource("automated"))).toEqual(
      new Set(["technology-providers", "future-outlook"]),
    );
  });

  it("never collects the overview section, which renders its widgets unfiltered", () => {
    expect(
      getEmptySectionSlugs(
        [section(1, "overview", [UNANSWERED])],
        dataSource("automated"),
      ),
    ).toEqual(new Set());
  });
});
