import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import WidgetHeader from "@/containers/widget/widget-header";
import {
  VALID_WIDGET_VISUALIZATIONS,
  WIDGET_VISUALIZATIONS,
} from "@shared/dto/widgets/widget-visualizations.constants";

describe("WidgetHeader", () => {
  const mockProps = {
    indicator: "Test Indicator",
    question: "Test Question",
    visualisations: VALID_WIDGET_VISUALIZATIONS,
    onMenuOpenChange: vi.fn(),
    onMenuButtonClicked: vi.fn(),
  };

  it("renders the indicator and question correctly", () => {
    render(<WidgetHeader {...mockProps} />);

    expect(screen.getByText("Test Indicator")).toBeInTheDocument();
    expect(screen.getByText("Test Question")).toBeInTheDocument();
  });

  it("doesn't show the menu items by default", () => {
    render(<WidgetHeader {...mockProps} />);

    expect(screen.queryByText("Customize chart")).not.toBeInTheDocument();
    expect(screen.queryByText("Show as a bar chart")).not.toBeInTheDocument();
    expect(screen.queryByText("Show as a pie chart")).not.toBeInTheDocument();
    expect(screen.queryByText("Show as an area chart")).not.toBeInTheDocument();
    expect(screen.queryByText("Show as a map")).not.toBeInTheDocument();
  });

  it("opens list of menu options when menu button is clicked", async () => {
    render(<WidgetHeader {...mockProps} />);

    fireEvent.click(screen.getByRole("button"));

    expect(screen.queryByText("Customize chart")).toBeInTheDocument();
    expect(screen.queryByText("Show as a bar chart")).toBeInTheDocument();
    expect(screen.queryByText("Show as a pie chart")).toBeInTheDocument();
    expect(screen.queryByText("Show as an area chart")).toBeInTheDocument();
    expect(screen.queryByText("Show as a map")).toBeInTheDocument();
  });

  it("calls appropriate callbacks when interacting with the dropdown menu", async () => {
    render(<WidgetHeader {...mockProps} />);

    const menuTrigger = screen.getByRole("button");
    fireEvent.click(menuTrigger);

    expect(mockProps.onMenuOpenChange).toHaveBeenCalledWith(true);

    const pieChartOption = await screen.findByText("Show as a pie chart");
    fireEvent.click(pieChartOption);

    expect(mockProps.onMenuButtonClicked).toHaveBeenCalledWith(
      WIDGET_VISUALIZATIONS.PIE_CHART,
    );
  });

  it("applies custom className when provided", () => {
    const { container } = render(
      <WidgetHeader {...mockProps} className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
