import { WidgetSourceSplit } from "@shared/dto/widgets/base-widget-data.interface";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import OverviewSection from "@/containers/explore/section/overview-section";

import { TransformedWidget } from "@/types";

// The real widget pulls in the map renderer, which has no place in jsdom. The
// behaviour under test is which widgets the section chooses to render.
vi.mock("@/containers/widget/survey-analysis", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

const widget = (
  title: string,
  bySource?: WidgetSourceSplit,
): TransformedWidget =>
  ({
    title,
    indicator: title,
    description: "",
    question: "",
    defaultVisualization: "single_value",
    visualisations: ["single_value"],
    responseRate: 100,
    absoluteValue: 0,
    data: {
      raw: { counter: { value: 1, total: 1 } },
      percentages: { counter: { value: 1, total: 1 }, bySource },
    },
  }) as unknown as TransformedWidget;

const bothSources: WidgetSourceSplit = [
  { source: "survey", data: { counter: { value: 22, total: 22 } } },
  { source: "automated", data: { counter: { value: 432, total: 432 } } },
];

const overviewWidgets = (bySource?: WidgetSourceSplit) => [
  widget("Adoption of technology by country"),
  widget("Total number of countries", bySource),
  widget("Total number of surveys", bySource),
  widget("Sector"),
];

const tileMenuItems = [
  { name: "General information", description: "", slug: "general-information" },
];

describe("OverviewSection", () => {
  it("shows the map and the sector breakdown for a single data source", () => {
    render(
      <OverviewSection
        widgets={overviewWidgets()}
        tileMenuItems={tileMenuItems}
      />,
    );

    expect(
      screen.getByText("Adoption of technology by country"),
    ).toBeInTheDocument();
    expect(screen.getByText("Sector")).toBeInTheDocument();
    expect(screen.getByText("Total number of countries")).toBeInTheDocument();
    expect(screen.getByText("General information")).toBeInTheDocument();
  });

  it("drops them for the counters alone once sources are combined", () => {
    render(
      <OverviewSection
        widgets={overviewWidgets(bothSources)}
        tileMenuItems={tileMenuItems}
      />,
    );

    expect(
      screen.queryByText("Adoption of technology by country"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Sector")).not.toBeInTheDocument();
    expect(screen.getByText("Total number of countries")).toBeInTheDocument();
    expect(screen.getByText("Total number of surveys")).toBeInTheDocument();
    expect(screen.getByText("General information")).toBeInTheDocument();
  });
});
