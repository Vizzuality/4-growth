import { WIDGET_VISUALIZATIONS } from "@shared/dto/widgets/widget-visualizations.constants";
import { fireEvent, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { describe, expect, it, vi } from "vitest";

import VisualizationSelector from "@/containers/sidebar/visualization-selector";

import { TransformedWidget } from "@/types";

const widget = {
  visualisations: [
    WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART,
    WIDGET_VISUALIZATIONS.PIE_CHART,
  ],
} as TransformedWidget;

function renderSelector(props: { breakdown?: string | null } = {}) {
  const onVisualizationSelected = vi.fn();

  render(
    <Provider store={createStore()}>
      <VisualizationSelector
        indicator="adoption-of-technology"
        visualization={WIDGET_VISUALIZATIONS.PIE_CHART}
        widget={widget}
        onVisualizationSelected={onVisualizationSelected}
        {...props}
      />
    </Provider>,
  );

  return { onVisualizationSelected };
}

describe("VisualizationSelector", () => {
  it("selects a supported type when nothing restricts the widget", () => {
    const { onVisualizationSelected } = renderSelector();

    fireEvent.click(screen.getByRole("button", { name: /Type/ }));
    fireEvent.click(screen.getByRole("button", { name: "Pie chart" }));

    expect(onVisualizationSelected).toHaveBeenCalledWith(
      WIDGET_VISUALIZATIONS.PIE_CHART,
    );
  });

  it("ignores clicks on a type a breakdown has ruled out", () => {
    const { onVisualizationSelected } = renderSelector({
      breakdown: "sector",
    });

    fireEvent.click(screen.getByRole("button", { name: /Type/ }));

    const pieChart = screen.getByRole("button", { name: "Pie chart" });
    expect(pieChart).toHaveAttribute("aria-disabled", "true");

    fireEvent.click(pieChart);

    expect(onVisualizationSelected).not.toHaveBeenCalled();
  });

  it("announces the type actually rendered while a breakdown is active", () => {
    renderSelector({ breakdown: "sector" });

    expect(
      screen.getByRole("button", { name: /Horizontal bar chart/ }),
    ).toBeInTheDocument();
  });
});
