import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import HorizontalBarChart from "@/containers/widget/horizontal-bar-chart";
import type { ResponsiveContainerProps } from "recharts";

vi.mock("recharts", async () => {
  const mockRecharts = await vi.importActual<any>("recharts");
  return {
    ...mockRecharts,
    ResponsiveContainer: ({ children }: ResponsiveContainerProps) => (
      <mockRecharts.ResponsiveContainer width={800} height={800}>
        {children}
      </mockRecharts.ResponsiveContainer>
    ),
  };
});

vi.mock("@/containers/no-data", () => ({
  default: () => <div data-testid="no-data">No data</div>,
}));

describe("HorizontalBarChart", () => {
  const mockData = [
    { label: "Option A", value: 50, total: 50 },
    { label: "Option B", value: 30, total: 30 },
    { label: "Option C", value: 20, total: 20 },
  ];

  it("renders all data points correctly with correct styles and attributes", async () => {
    render(<HorizontalBarChart data={mockData} />);

    await waitFor(() => {
      mockData.forEach(({ label, value }) => {
        const percentageElement = screen.getByText(value);
        expect(percentageElement).toHaveAttribute("font-weight", "bold");

        const labelElement = screen.getByText(label);
        expect(labelElement).not.toHaveAttribute("font-weight", "bold");
      });
    });
  });

  it("renders the correct number of bars with the correct fill color", async () => {
    const { container } = render(<HorizontalBarChart data={mockData} />);

    await waitFor(() => {
      const bars = container.querySelectorAll(".recharts-rectangle");
      expect(bars).toHaveLength(3);
      expect(bars[0]).toHaveAttribute("fill", "hsl(var(--accent))");
      expect(bars[1]).toHaveAttribute("fill", "hsl(var(--secondary))");
      expect(bars[2]).toHaveAttribute("fill", "hsl(var(--secondary))");
    });
  });

  it("should set fixed height to each bar when barSize prop is passed", () => {
    const barSize = 47;
    const { container } = render(
      <HorizontalBarChart data={mockData} barSize={barSize} />,
    );

    const bars = container.querySelectorAll(".recharts-rectangle");

    bars.forEach((bar) => {
      expect(bar).toHaveAttribute("height", barSize.toString());
    });
  });

  it("updates correctly when props change", async () => {
    const { container, rerender } = render(
      <HorizontalBarChart data={mockData} />,
    );

    await waitFor(() => {
      mockData.forEach(({ label, value }) => {
        expect(screen.getByText(value)).toBeInTheDocument();
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });

    const newData = [
      { label: "Option A", value: 60, total: 60 },
      { label: "Option B", value: 30, total: 30 },
      { label: "Option C", value: 10, total: 10 },
    ];
    rerender(<HorizontalBarChart data={newData} />);

    await waitFor(() => {
      const bars = container.querySelectorAll(".recharts-rectangle");
      expect(bars).toHaveLength(3);
      newData.forEach(({ label, value }) => {
        expect(screen.getByText(value)).toBeInTheDocument();
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });
  });

  it("handles empty data gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    render(<HorizontalBarChart data={[]} />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "HorizontalBarChart: Expected at least 1 data point, but received 0.",
    );
    expect(screen.getByTestId("no-data")).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
