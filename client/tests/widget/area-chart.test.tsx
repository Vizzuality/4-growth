import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AreaChart from "@/containers/widget/area-chart";

describe("AreaChart", () => {
  const mockProps = {
    indicator: "Test",
    data: [
      { label: "Yes", value: 30, total: 30 },
      { label: "No", value: 20, total: 20 },
      { label: "Maybe", value: 50, total: 50 },
    ],
  };

  it("renders the correct labels and values", () => {
    render(<AreaChart {...mockProps} />);
    expect(screen.getByText("30%")).toBeInTheDocument();
    expect(screen.getByText("No 20%")).toBeInTheDocument();
    expect(screen.getByText("Maybe 50%")).toBeInTheDocument();
  });

  it("renders the correct main value", () => {
    render(<AreaChart {...mockProps} />);
    expect(screen.getByText("30%")).toHaveClass("text-2xl");
  });

  it("sets the correct width and background color for each segment based on data values", () => {
    render(<AreaChart {...mockProps} />);

    const segments = screen.getAllByTestId("area-chart-segment");

    expect(segments).toHaveLength(3);
    expect(segments[0]).toHaveStyle("width: 30%");
    expect(segments[0]).toHaveClass("bg-secondary");
    expect(segments[1]).toHaveStyle("width: 20%");
    expect(segments[1]).not.toHaveClass("bg-secondary");
    expect(segments[2]).toHaveStyle("width: 50%");
    expect(segments[2]).toHaveClass(
      "bg-[url('/images/area-graph-pattern.png')]",
    );
  });

  it("updates correctly when props change", () => {
    const { rerender } = render(<AreaChart {...mockProps} />);
    expect(screen.getByText("30%")).toBeInTheDocument();

    const newData = [
      { label: "Yes", value: 10, total: 10 },
      { label: "No", value: 80, total: 80 },
      { label: "Maybe", value: 10, total: 10 },
    ];
    rerender(<AreaChart {...mockProps} data={newData} />);
    expect(screen.getByText("10%")).toBeInTheDocument();
    expect(screen.getByText("No 80%")).toBeInTheDocument();
    expect(screen.getByText("Maybe 10%")).toBeInTheDocument();
  });

  it("handles empty data gracefully", () => {
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    render(<AreaChart {...mockProps} data={[]} />);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "AreaChart - Test: Expected exactly 3 data points, but received 0.",
    );
    expect(screen.queryByTestId("area-chart-segment")).not.toBeInTheDocument();
  });

  it("handles incorrect amount of data gracefully", () => {
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    render(
      <AreaChart
        {...mockProps}
        data={[{ label: "Yes", value: 100, total: 100 }]}
      />,
    );

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "AreaChart - Test: Expected exactly 3 data points, but received 1.",
    );
    expect(screen.queryByTestId("area-chart-segment")).not.toBeInTheDocument();
  });
});
