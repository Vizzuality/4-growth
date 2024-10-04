import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WIDGET_VISUALIZATIONS } from "@shared/dto/widgets/widget-visualizations.constants";
import Navigation from "@/containers/widget/navigation";

describe("Navigation Component", () => {
  const mockProps = {
    indicator: "Test",
    visualization: WIDGET_VISUALIZATIONS.FILTER,
    href: "#",
  };

  it("renders filter visualization correctly", () => {
    render(<Navigation {...mockProps} />);

    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("Apply filters")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "#");
  });

  it("renders navigation visualization correctly", () => {
    render(
      <Navigation
        {...mockProps}
        visualization={WIDGET_VISUALIZATIONS.NAVIGATION}
      />,
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("Explore in Sandbox")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "#");
  });

  it("renders nothing for unsupported visualization type", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = render(
      <Navigation {...mockProps} visualization={"UNSUPPORTED" as any} />,
    );

    expect(container.firstChild).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Navigation widget: Unsupported visualization type "UNSUPPORTED" for indicator "Test".',
    );
    consoleSpy.mockRestore();
  });

  it("renders ArrowRight icon for both visualizations", () => {
    const { container, rerender } = render(
      <Navigation
        {...mockProps}
        visualization={WIDGET_VISUALIZATIONS.FILTER}
      />,
    );
    expect(container.querySelector("svg")).toHaveClass(
      "lucide lucide-arrow-right",
    );

    rerender(
      <Navigation
        {...mockProps}
        visualization={WIDGET_VISUALIZATIONS.NAVIGATION}
      />,
    );
    expect(container.querySelector("svg")).toHaveClass(
      "lucide lucide-arrow-right",
    );
  });
});
