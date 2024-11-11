import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WidgetHeader from "@/containers/widget/widget-header";

describe("WidgetHeader", () => {
  const mockProps = {
    indicator: "Test Indicator",
  };

  it("renders the indicator correctly", () => {
    render(<WidgetHeader {...mockProps} />);

    expect(screen.queryByText("Test Indicator")).toBeInTheDocument();
  });

  it("renders a question if passed as props", () => {
    const { rerender } = render(<WidgetHeader {...mockProps} />);
    const question = "Test Question";

    expect(screen.queryByText(question)).not.toBeInTheDocument();

    rerender(<WidgetHeader {...mockProps} question={question} />);

    expect(screen.queryByText(question)).toBeInTheDocument();
  });

  it("renders a menu if passed as props", () => {
    const { rerender } = render(<WidgetHeader {...mockProps} />);
    const Menu = () => <div data-testid="menu">Menu</div>;

    expect(screen.queryByTestId("menu")).not.toBeInTheDocument();

    rerender(<WidgetHeader {...mockProps} menu={<Menu />} />);

    expect(screen.queryByTestId("menu")).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    const { container } = render(
      <WidgetHeader {...mockProps} className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
