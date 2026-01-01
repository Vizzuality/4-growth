import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ResponsiveContainerProps } from "recharts";
import LineChart from "@/containers/widget/line-chart";

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

describe("LineChart", () => {
  const mockProps = {
    indicator: "Market potential",
    unit: "USD",
    dataKey: "value",
    data: [
      { year: 2020, value: 100 },
      { year: 2021, value: 50 },
      { year: 2022, value: 20 },
    ],
  };

  it("renders the line chart with correct path element", () => {
    render(<LineChart {...mockProps} />);

    const linePath = screen
      .getByRole("application")
      .querySelector("path.recharts-line-curve");
    expect(linePath).toBeInTheDocument();
    expect(linePath).toHaveAttribute("stroke-width", "10");
    expect(linePath).toHaveAttribute("stroke", "hsl(var(--secondary))");
    expect(linePath).toHaveAttribute("fill", "none");
    expect(linePath).toHaveAttribute(
      "class",
      "recharts-curve recharts-line-curve",
    );
  });

  it("handles empty data gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    render(<LineChart {...mockProps} data={[]} />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "LineChart: Expected at least 1 data point, but received 0.",
    );
    expect(screen.getByTestId("no-data")).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
