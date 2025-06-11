import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Widget, { WidgetProps } from "@/containers/widget/survey-analysis";
import {
  WIDGET_VISUALIZATIONS,
  WidgetVisualizationsType,
} from "@shared/dto/widgets/widget-visualizations.constants";
import HorizontalBarChart from "@/containers/widget/horizontal-bar-chart";
import { getRouteHref } from "@/utils/route-config";

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

vi.mock("@/containers/widget/map", () => ({
  default: () => <div data-testid={WIDGET_VISUALIZATIONS.MAP}>Map widget</div>,
}));

vi.mock("@/containers/no-data", () => ({
  default: () => <div data-testid="no-data">No data</div>,
}));

vi.mock("@/containers/widget/breakdown", () => ({
  default: () => <div data-testid="breakdown">Breakdown Chart</div>,
}));

describe("Widget", () => {
  const mockChartData = { chart: [{ label: "Test", value: 100, total: 100 }] };
  const mockProps: WidgetProps = {
    indicator: "Test Indicator",
    question: "Test Question",
    responseRate: 80,
    visualization: WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART,
    data: { raw: mockChartData, percentages: mockChartData },
  };
  const menuButtonTestId = "menu-button";

  Object.values(WIDGET_VISUALIZATIONS).forEach((visualizationType) => {
    it(`renders the correct visualization for ${visualizationType}`, () => {
      let props: WidgetProps = mockProps;

      if (
        visualizationType === WIDGET_VISUALIZATIONS.FILTER ||
        visualizationType === WIDGET_VISUALIZATIONS.NAVIGATION
      ) {
        props = {
          ...props,
          data: {
            raw: { navigation: { href: "#" } },
            percentages: { navigation: { href: "#" } },
          },
        };
      }

      render(<Widget {...props} visualization={visualizationType} />);

      expect(screen.getByTestId(visualizationType)).toBeInTheDocument();
    });
  });

  it("Hides the menu if no menuItems or visualisations are passed", () => {
    render(<Widget {...mockProps} />);

    expect(screen.queryByTestId(menuButtonTestId)).not.toBeInTheDocument();
  });

  it("renders the customize chart button with the correct href value", () => {
    render(<Widget {...mockProps} showCustomizeWidgetButton />);

    const menuButton = screen.getByTestId(menuButtonTestId);
    fireEvent.click(menuButton);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      getRouteHref("surveyAnalysis", "sandbox") +
        `?visualization=${mockProps.visualization}&indicator=${mockProps.indicator}`,
    );
  });

  it("renders the default visualization and switches visualization when menu item is clicked", async () => {
    render(
      <Widget
        {...mockProps}
        visualisations={Object.values(WIDGET_VISUALIZATIONS)}
      />,
    );
    expect(
      screen.queryByTestId(WIDGET_VISUALIZATIONS.PIE_CHART),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId(WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART),
    ).toBeInTheDocument();

    const menuButton = screen.getByTestId(menuButtonTestId);
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

  it("applies correct classes based on showMenu state", async () => {
    render(
      <Widget
        {...mockProps}
        visualisations={Object.values(WIDGET_VISUALIZATIONS)}
      />,
    );

    const card = screen
      .getByTestId(WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART)
      .closest('div[class*="relative"]');
    expect(card).not.toHaveClass("z-50");

    const menuButton = screen.getByTestId(menuButtonTestId);
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(card).toHaveClass("z-50");
    });
  });

  it("renders breakdown chart when breakdown props is passed", () => {
    const data = {
      breakdown: [
        {
          label: "Category 1",
          data: [{ label: "Option A", value: 100, total: 100 }],
        },
      ],
    };
    render(
      <Widget
        {...mockProps}
        breakdown="another-indicator"
        data={{
          raw: data,
          percentages: data,
        }}
      />,
    );

    expect(screen.getByTestId("breakdown")).toBeInTheDocument();
  });

  it("renders null for unsupported visualization type", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const props = {
      ...mockProps,
      visualization: "pyramid_chart" as WidgetVisualizationsType,
    };
    const { container } = render(<Widget {...props} />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Widget: Unsupported visualization type "pyramid_chart" for indicator "Test Indicator".',
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders no-data component when widget data is empty", async () => {
    render(
      <Widget
        {...mockProps}
        data={{ raw: { chart: [] }, percentages: { chart: [] } }}
      />,
    );

    expect(screen.getByTestId("no-data")).toBeInTheDocument();
  });

  it("renders the correct response rate value", () => {
    render(<Widget {...mockProps} />);

    const ele = screen.getByTestId("response-rate");

    expect(ele.firstChild).toHaveClass("lucide-clipboard-check");
    expect(ele).toHaveTextContent(`${mockProps.responseRate}%`);
  });
});
