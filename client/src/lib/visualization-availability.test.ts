import { WIDGET_VISUALIZATIONS } from "@shared/dto/widgets/widget-visualizations.constants";
import { describe, expect, it } from "vitest";

import {
  SELECTABLE_VISUALIZATIONS,
  getVisualizationAvailability,
} from "@/lib/visualization-availability";

const SUPPORTED = [...SELECTABLE_VISUALIZATIONS];

const availability = (
  overrides: Partial<Parameters<typeof getVisualizationAvailability>[0]> = {},
) =>
  getVisualizationAvailability({
    candidates: SELECTABLE_VISUALIZATIONS,
    visualisations: SUPPORTED,
    selectedVisualization: WIDGET_VISUALIZATIONS.PIE_CHART,
    ...overrides,
  });

const reasonFor = (
  result: ReturnType<typeof getVisualizationAvailability>,
  visualization: (typeof SELECTABLE_VISUALIZATIONS)[number],
) =>
  result.disabled.find((entry) => entry.visualization === visualization)
    ?.reason;

describe("getVisualizationAvailability", () => {
  it("leaves every supported type selectable when nothing restricts the widget", () => {
    const result = availability();

    expect(result.disabled).toEqual([]);
    expect(result.effectiveVisualization).toBe(WIDGET_VISUALIZATIONS.PIE_CHART);
  });

  it("keeps the selected type intact while a breakdown forces bars", () => {
    const result = availability({ breakdown: "sector" });

    expect(result.effectiveVisualization).toBe(
      WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART,
    );
    expect(reasonFor(result, WIDGET_VISUALIZATIONS.PIE_CHART)).toBe(
      "breakdown",
    );
    expect(
      reasonFor(result, WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART),
    ).toBeUndefined();
  });

  it("restricts to bars when several data sources are compared", () => {
    const result = availability({ hasMultipleSources: true });

    expect(result.effectiveVisualization).toBe(
      WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART,
    );
    expect(reasonFor(result, WIDGET_VISUALIZATIONS.AREA_GRAPH)).toBe(
      "comparison",
    );
  });

  it("reports the unsupported indicator ahead of restrictions the user can clear", () => {
    const result = availability({
      visualisations: [WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART],
      breakdown: "sector",
      hasMultipleSources: true,
    });

    expect(reasonFor(result, WIDGET_VISUALIZATIONS.PIE_CHART)).toBe(
      "indicator",
    );
  });

  it("reports the breakdown ahead of the comparison when both are active", () => {
    const result = availability({
      breakdown: "sector",
      hasMultipleSources: true,
    });

    expect(reasonFor(result, WIDGET_VISUALIZATIONS.PIE_CHART)).toBe(
      "breakdown",
    );
  });

  it("disables everything while the widget is still unknown", () => {
    const result = availability({ visualisations: undefined });

    expect(result.disabled.map(({ reason }) => reason)).toEqual(
      SELECTABLE_VISUALIZATIONS.map(() => "indicator"),
    );
  });
});
