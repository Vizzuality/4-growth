import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import BreakdownChart from "@/containers/widget/breakdown";
import { CSS_CHART_COLORS, TW_CHART_COLORS } from "@/lib/constants";
import type { ResponsiveContainerProps } from "recharts";
import { WidgetBreakdownData } from "@shared/dto/widgets/base-widget-data.interface";

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

const mockData: WidgetBreakdownData = [
  {
    label: "Category 1",
    data: [{ label: "Option A", value: 100, total: 100 }],
  },
  {
    label: "Category 2",
    data: [
      { label: "Option A", value: 60, total: 100 },
      { label: "Option B", value: 25, total: 100 },
      { label: "Option C", value: 15, total: 100 },
    ],
  },
  {
    label: "Category 3",
    data: [
      { label: "Option A", value: 50, total: 100 },
      { label: "Option B", value: 30, total: 100 },
      { label: "Option C", value: 20, total: 100 },
    ],
  },
];

describe("BreakdownChart", () => {
  const renderChart = (data = mockData) =>
    render(<BreakdownChart data={data} />);

  it("renders all category sections with their labels", async () => {
    renderChart();

    await waitFor(() => {
      mockData.forEach(({ label }) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });
  });

  it("renders charts for each category with correct styling", async () => {
    const { container } = renderChart();

    await waitFor(() => {
      const charts = container.querySelectorAll(".breakdown-chart > div");
      expect(charts).toHaveLength(mockData.length + 1); // +1 for legend

      const bars = container.querySelectorAll(".recharts-rectangle");
      const expectedBarsCount = mockData.reduce(
        (acc, curr) => acc + curr.data.length,
        0,
      );
      expect(bars).toHaveLength(expectedBarsCount);
    });
  });

  it("applies correct colors to bars based on CSS_CHART_COLORS", async () => {
    const { container } = renderChart();

    await waitFor(() => {
      mockData.forEach(({ data }) => {
        data.forEach((_, index) => {
          const bars = container.querySelectorAll(
            `.recharts-bar-rectangle:nth-child(${index + 1}) path`,
          );
          bars.forEach((bar) => {
            expect(bar).toHaveAttribute("fill", CSS_CHART_COLORS[index]);
          });
        });
      });
    });
  });

  it("renders the legend with correct colors and labels", async () => {
    renderChart();

    await waitFor(() => {
      const legendItems = screen.getByTestId("breakdown-chart-legend").children;
      const categoryData = mockData[1].data;

      expect(legendItems).toHaveLength(categoryData.length);

      categoryData.forEach(({ label }, index) => {
        const legendItem = legendItems[index];
        const colorDot = legendItem.querySelector(".h-3.w-3.rounded-full");
        const labelText = legendItem.querySelector("span:last-child");

        expect(colorDot).toHaveClass(TW_CHART_COLORS[index]);
        expect(labelText).toHaveTextContent(label);
      });
    });
  });

  it("handles empty data gracefully", async () => {
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    render(<BreakdownChart data={[]} />);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Breakdown: Expected at least 1 data point, but received 0.",
    );
    expect(screen.getByTestId("no-data")).toBeInTheDocument();

    consoleWarnSpy.mockRestore();
  });
});
