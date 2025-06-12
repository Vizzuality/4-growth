import { vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import type { ResponsiveContainerProps } from "recharts";
import VerticalBarChart from "@/containers/widget/vertical-bar-chart";

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

describe("VerticalBarChart", () => {
  const mockProps = {
    title: "Market potential",
    data: [
      { year: 2020, value: 100 },
      { year: 2021, value: 50 },
      { year: 2022, value: 20 },
    ],
  };

  it("renders the correct number of bars with the correct fill color", async () => {
    const { container } = render(<VerticalBarChart {...mockProps} />);

    await waitFor(() => {
      const bars = container.querySelectorAll(".recharts-rectangle");
      expect(bars).toHaveLength(mockProps.data.length);
      expect(bars[0]).toHaveAttribute("fill", "hsl(var(--accent))");
      expect(bars[1]).toHaveAttribute("fill", "hsl(var(--secondary))");
      expect(bars[2]).toHaveAttribute("fill", "hsl(var(--secondary))");
    });
  });

  it("renders a tooltip with the correct content", async () => {
    const { container } = render(<VerticalBarChart {...mockProps} />);

    await waitFor(() => {
      const bar = container.querySelector(".recharts-rectangle");

      if (bar) {
        fireEvent.focus(bar);
        const tooltipWrapper = container.querySelector(
          ".recharts-tooltip-wrapper",
        ) as HTMLElement | null;

        if (tooltipWrapper) {
          const tooltip = within(tooltipWrapper);
          expect(tooltip.getByText("Year")).toBeTruthy();
          expect(tooltip.getByText(mockProps.data[0].year)).toBeTruthy();
          expect(tooltip.getByText(mockProps.title)).toBeTruthy();
          expect(tooltip.getByText(mockProps.data[0].value)).toBeTruthy();
        } else {
          throw new Error("Unable to trigger tooltip in VerticalBarChart");
        }
      } else {
        throw new Error("Unable to find bar in VerticalBarChart");
      }
    });
  });

  it("handles empty data gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    render(<VerticalBarChart {...mockProps} data={[]} />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "VerticalBarChart: Expected at least 1 data point, but received 0.",
    );
    expect(screen.getByTestId("no-data")).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
