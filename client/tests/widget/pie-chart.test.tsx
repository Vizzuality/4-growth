import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import PieChart from "@/containers/widget/pie-chart";
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

describe("PieChart", () => {
  const mockData = [
    { label: "Option A", value: 50, total: 50 },
    { label: "Option B", value: 30, total: 30 },
    { label: "Option C", value: 20, total: 20 },
  ];

  it("renders all data points correctly with correct styles and attributes", async () => {
    render(<PieChart data={mockData} />);

    await waitFor(() => {
      mockData.forEach(({ label, value }, index) => {
        const percentageElement = screen.getByText(`${value}%`);
        expect(percentageElement).toHaveClass("font-black");

        const labelElement = screen.getByText(label);
        expect(labelElement).not.toHaveClass("font-black");

        const colorIndicator = screen.getByText(
          `${value}%`,
        ).previousElementSibling;
        expect(colorIndicator).toHaveClass(`bg-chart-${index + 1}`);
      });
    });
  });

  it("renders the correct number of pie slices with the correct fill color", async () => {
    const { container } = render(<PieChart data={mockData} />);

    await waitFor(() => {
      const pieSlices = container.querySelectorAll(".recharts-sector");
      expect(pieSlices).toHaveLength(3);
      pieSlices.forEach((slice, index) => {
        expect(slice).toHaveAttribute("fill", `hsl(var(--chart-${index + 1}))`);
      });
    });
  });

  it("updates correctly when props change", async () => {
    const { container, rerender } = render(<PieChart data={mockData} />);

    await waitFor(() => {
      mockData.forEach(({ label, value }) => {
        expect(screen.getByText(`${value}%`)).toBeInTheDocument();
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });

    const newData = [
      { label: "Option A", value: 60, total: 60 },
      { label: "Option B", value: 30, total: 30 },
      { label: "Option C", value: 10, total: 10 },
    ];
    rerender(<PieChart data={newData} />);

    await waitFor(() => {
      const pieSlices = container.querySelectorAll(".recharts-pie-sector");
      expect(pieSlices).toHaveLength(3);
      newData.forEach(({ label, value }) => {
        expect(screen.getByText(`${value}%`)).toBeInTheDocument();
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });
  });

  it("handles empty data gracefully", async () => {
    const { container } = render(<PieChart data={[]} />);

    await waitFor(() => {
      expect(container.querySelector(".recharts-surface")).toBeInTheDocument();
    });
  });
});
