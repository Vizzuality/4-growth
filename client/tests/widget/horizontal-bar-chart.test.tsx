import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ExploreHorizontalBarChart from "@/containers/widget/horizontal-bar-chart/explore";
import SandboxHorizontalBarChart from "@/containers/widget/horizontal-bar-chart/sandbox";
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

  createChartTests(ExploreHorizontalBarChart, "In Explore page", () => {
    it("handles empty data gracefully", async () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      const { container } = render(<ExploreHorizontalBarChart data={[]} />);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "HorizontalBarChart: Expected at least 1 data point, but received 0.",
      );
      expect(container.firstChild).toBeNull();
    });
  });

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

    it("handles empty data gracefully", async () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      const { container } = render(<SandboxHorizontalBarChart data={[]} />);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "HorizontalBarChart: Expected at least 1 data point, but received 0.",
      );
      expect(container.firstChild?.firstChild).toBeNull();
    });
  });
});
