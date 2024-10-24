import { vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ExploreHorizontalBarChart from "@/containers/widget/horizontal-bar-chart/explore";
import SandboxHorizontalBarChart from "@/containers/widget/horizontal-bar-chart/sandbox";
import BreakdownChart from "@/containers/widget/horizontal-bar-chart/breakdown";
import { CSS_CHART_COLORS, TW_CHART_COLORS } from "@/lib/constants";
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

const mockData = [
  { label: "Option A", value: 50 },
  { label: "Option B", value: 30 },
  { label: "Option C", value: 20 },
];

const newMockData = [
  { label: "Option A", value: 60 },
  { label: "Option B", value: 30 },
  { label: "Option C", value: 10 },
];

const mockBreakdownData = [
  {
    label: "Category 1",
    data: [
      { label: "Option A", value: 50 },
      { label: "Option B", value: 30 },
      { label: "Option C", value: 20 },
    ],
  },
  {
    label: "Category 2",
    data: [
      { label: "Option A", value: 60 },
      { label: "Option B", value: 25 },
      { label: "Option C", value: 15 },
    ],
  },
];

type ChartComponent =
  | typeof ExploreHorizontalBarChart
  | typeof SandboxHorizontalBarChart;

const createChartTests = (
  ChartComponent: ChartComponent,
  name: string,
  additionalTests?: () => void,
) => {
  describe(name, () => {
    const renderChart = (data = mockData) =>
      render(<ChartComponent data={data} />);

    it("renders all data points correctly with correct styles and attributes", async () => {
      renderChart();

      await waitFor(() => {
        mockData.forEach(({ label, value }) => {
          const percentageElement = screen.getByText(`${value}%`);
          expect(percentageElement).toHaveAttribute("font-weight", "900");

          const labelElement = screen.getByText(label);
          expect(labelElement).not.toHaveAttribute("font-weight", "900");
        });
      });
    });

    it("renders the correct number of bars with the correct fill color", async () => {
      const { container } = renderChart();

      await waitFor(() => {
        const bars = container.querySelectorAll(".recharts-rectangle");
        expect(bars).toHaveLength(3);
        expect(bars[0]).toHaveAttribute("fill", "hsl(var(--accent))");
        expect(bars[1]).toHaveAttribute("fill", "hsl(var(--secondary))");
        expect(bars[2]).toHaveAttribute("fill", "hsl(var(--secondary))");
      });
    });

    it("updates correctly when props change", async () => {
      const { container, rerender } = renderChart();

      await waitFor(() => {
        mockData.forEach(({ label, value }) => {
          expect(screen.getByText(`${value}%`)).toBeInTheDocument();
          expect(screen.getByText(label)).toBeInTheDocument();
        });
      });

      rerender(<ChartComponent data={newMockData} />);

      await waitFor(() => {
        const bars = container.querySelectorAll(".recharts-rectangle");
        expect(bars).toHaveLength(3);
        newMockData.forEach(({ label, value }) => {
          expect(screen.getByText(`${value}%`)).toBeInTheDocument();
          expect(screen.getByText(label)).toBeInTheDocument();
        });
      });
    });

    it("handles empty data gracefully", async () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      const { container } = render(<ChartComponent data={[]} />);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `${ChartComponent.displayName}: Expected at least 1 data point, but received 0.`,
      );
      expect(container.firstChild).toBeNull();
    });

    if (additionalTests) {
      additionalTests();
    }
  });
};

describe("HorizontalBarChart", () => {
  beforeAll(() => {
    // Prevents throwing canvas error:
    global.HTMLCanvasElement.prototype.getContext = vi.fn();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  createChartTests(ExploreHorizontalBarChart, "In Explore page");

  createChartTests(SandboxHorizontalBarChart, "In Sandbox page", () => {
    it("renders the dotted line", async () => {
      const { container } = render(
        <SandboxHorizontalBarChart data={mockData} />,
      );

      await waitFor(() => {
        const lines = container.querySelectorAll("line");
        expect(lines).toHaveLength(mockData.length);
        lines.forEach((line) => {
          expect(line).toHaveAttribute("stroke-dasharray", "3 3");
        });
      });
    });
  });

  describe("BreakdownChart", () => {
    const renderChart = (data = mockBreakdownData) =>
      render(<BreakdownChart data={data} />);

    it("renders all category sections with their labels", async () => {
      renderChart();

      await waitFor(() => {
        mockBreakdownData.forEach(({ label }) => {
          expect(screen.getByText(label)).toBeInTheDocument();
        });
      });
    });

    it("renders charts for each category with correct styling", async () => {
      const { container } = renderChart();

      await waitFor(() => {
        const charts = container.querySelectorAll(".breakdown-chart > div");
        expect(charts).toHaveLength(mockBreakdownData.length + 1); // +1 for legend

        const bars = container.querySelectorAll(".recharts-rectangle");
        const expectedBarsCount = mockBreakdownData.reduce(
          (acc, curr) => acc + curr.data.length,
          0,
        );
        expect(bars).toHaveLength(expectedBarsCount);
      });
    });

    it("applies correct colors to bars based on CSS_CHART_COLORS", async () => {
      const { container } = renderChart();

      await waitFor(() => {
        mockBreakdownData.forEach(({ data }) => {
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
        const legendItems = screen.getByTestId(
          "breakdown-chart-legend",
        ).children;
        const categoryData = mockBreakdownData[0].data;

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
      const { container } = render(<BreakdownChart data={[]} />);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `${BreakdownChart.displayName}: Expected at least 1 data point, but received 0.`,
      );
      expect(container.firstChild).toBeNull();

      consoleWarnSpy.mockRestore();
    });
  });
});
