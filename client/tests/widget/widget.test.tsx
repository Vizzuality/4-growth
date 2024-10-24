import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Widget, { WidgetProps } from "@/containers/widget";
import {
  WIDGET_VISUALIZATIONS,
  WidgetVisualizationsType,
} from "@shared/dto/widgets/widget-visualizations.constants";
import HorizontalBarChart from "@/containers/widget/horizontal-bar-chart";

vi.mock("@/containers/widget/horizontal-bar-chart", async () => {
  const actual = await vi.importActual<typeof HorizontalBarChart>(
    "@/containers/widget/horizontal-bar-chart",
  );
  return {
    ...actual,
    default: () => (
      <div data-testid={WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART}>
        Horizontal Bar Chart
      </div>
    ),
  };
});

vi.mock("@/containers/widget/pie-chart", () => ({
  default: () => (
    <div data-testid={WIDGET_VISUALIZATIONS.PIE_CHART}>Pie Chart</div>
  ),
}));

vi.mock("@/containers/widget/area-chart", () => ({
  default: () => (
    <div data-testid={WIDGET_VISUALIZATIONS.AREA_GRAPH}>Area Chart</div>
  ),
}));

vi.mock("@/containers/widget/single-value", () => ({
  default: () => (
    <div data-testid={WIDGET_VISUALIZATIONS.SINGLE_VALUE}>Single Value</div>
  ),
}));

vi.mock("@/containers/widget/navigation", () => ({
  default: () => (
    <div data-testid={WIDGET_VISUALIZATIONS.NAVIGATION}>Navigation widget</div>
  ),
}));

vi.mock("@/containers/widget/filter", () => ({
  default: () => (
    <div data-testid={WIDGET_VISUALIZATIONS.FILTER}>Filter widget</div>
  ),
}));

describe("Widget", () => {
  const mockProps = {
    indicator: "Test Indicator",
    question: "Test Question",
    defaultVisualization: WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART,
    visualisations: Object.values(WIDGET_VISUALIZATIONS),
    data: { chart: [{ label: "Test", value: 100, total: 100 }] },
    onMenuOpenChange: vi.fn(),
  };

  Object.values(WIDGET_VISUALIZATIONS).forEach((visualizationType) => {
    it(`renders the correct defaultVisualization for ${visualizationType}`, () => {
      let props: WidgetProps = mockProps;

      if (
        visualizationType === WIDGET_VISUALIZATIONS.FILTER ||
        visualizationType === WIDGET_VISUALIZATIONS.NAVIGATION
      ) {
        props = { ...props, data: { navigation: { href: "#" } } };
      }

      const { container } = render(
        <Widget {...props} defaultVisualization={visualizationType} />,
      );

      switch (visualizationType) {
        case WIDGET_VISUALIZATIONS.MAP:
          expect(container.firstChild).toBeNull();
          break;
        default:
          expect(screen.getByTestId(visualizationType)).toBeInTheDocument();
          break;
      }
    });
  });

  it("renders the default visualization and switches visualization when menu item is clicked", async () => {
    render(<Widget {...mockProps} />);
    expect(
      screen.queryByTestId(WIDGET_VISUALIZATIONS.PIE_CHART),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId(WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART),
    ).toBeInTheDocument();

    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);

    const pieChartOption = await screen.findByText("Show as a pie chart");
    fireEvent.click(pieChartOption);

    expect(
      screen.queryByTestId(WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId(WIDGET_VISUALIZATIONS.PIE_CHART),
    ).toBeInTheDocument();
  });

  it("calls onMenuOpenChange when menu is opened", () => {
    render(<Widget {...mockProps} />);

    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);

    expect(mockProps.onMenuOpenChange).toHaveBeenCalledWith(true);
  });

  it("applies correct classes based on showMenu state", async () => {
    render(<Widget {...mockProps} />);

    const card = screen
      .getByTestId(WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART)
      .closest('div[class*="relative"]');
    expect(card).not.toHaveClass("z-50");

    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(card).toHaveClass("z-50");
    });
  });

  it("renders null for unsupported visualization type", () => {
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    const props = {
      ...mockProps,
      defaultVisualization: "pyramid_chart" as WidgetVisualizationsType,
    };
    const { container } = render(<Widget {...props} />);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Widget: Unsupported visualization type "pyramid_chart" for indicator "Test Indicator".',
    );
    expect(container.firstChild).toBeNull();
  });
});
