import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AreaGraph from "@/containers/widget/area-graph";

vi.mock("@/containers/no-data", () => ({
  default: () => <div data-testid="no-data">No data</div>,
}));

describe("AreaGraph", () => {
  const mockProps = {
    indicator: "Test",
    data: [
      { label: "Yes", value: 30, total: 30 },
      { label: "No", value: 20, total: 20 },
      { label: "Maybe", value: 50, total: 50 },
    ],
  };

  it("renders the correct labels and values", () => {
    render(<AreaGraph {...mockProps} />);
    expect(screen.getByText("30%")).toBeInTheDocument();
    expect(screen.getByText("No 20%")).toBeInTheDocument();
    expect(screen.getByText("Maybe 50%")).toBeInTheDocument();
  });

  it("renders the correct main value", () => {
    render(<AreaGraph {...mockProps} />);
    expect(screen.getByText("30%")).toHaveClass("text-2xl");
  });

  it("sets the correct width and background color for each segment based on data values", () => {
    render(<AreaGraph {...mockProps} />);

    const segments = screen.getAllByTestId("area-graph-segment");

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
    const { rerender } = render(<AreaGraph {...mockProps} />);
    expect(screen.getByText("30%")).toBeInTheDocument();

    const twoDataPoints = [
      { label: "Yes", value: 20, total: 20 },
      { label: "No", value: 80, total: 80 },
    ];
    rerender(<AreaGraph {...mockProps} data={twoDataPoints} />);
    expect(screen.getByText("20%")).toBeInTheDocument();
    expect(screen.getByText("No 80%")).toBeInTheDocument();

    const oneDataPoint = [{ label: "Yes", value: 40, total: 40 }];
    rerender(<AreaGraph {...mockProps} data={oneDataPoint} />);
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("handles empty data gracefully", () => {
    render(<AreaGraph {...mockProps} data={[]} />);

    expect(screen.queryByTestId("area-graph-segment")).not.toBeInTheDocument();
    expect(screen.getByTestId("no-data")).toBeInTheDocument();
  });

  it("handles incorrect amount of data gracefully", () => {
    const arrayLength = 4;
    render(
      <AreaGraph
        {...mockProps}
        data={Array.from({ length: arrayLength }).map((_, i) => ({
          label: `Option ${String.fromCharCode(65 + i)}`,
          value: 20,
          total: 100,
        }))}
      />,
    );

    expect(screen.queryByTestId("area-graph-segment")).not.toBeInTheDocument();
    expect(screen.getByTestId("no-data")).toBeInTheDocument();
  });
});
