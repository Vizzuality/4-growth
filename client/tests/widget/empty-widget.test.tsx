import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EmptyWidget from "@/containers/widget/empty-widget";

describe("EmptyWidget", () => {
  const mockProps = {
    indicator: "An indicator",
  };

  it("renders the correct content and updates when props change", () => {
    const { rerender } = render(<EmptyWidget {...mockProps} />);

    expect(screen.getByText("An indicator")).toBeInTheDocument();
    expect(screen.getByText("No data")).toBeInTheDocument();
    expect(
      screen.getByText("There was no data found for this visualization"),
    ).toBeInTheDocument();

    rerender(
      <EmptyWidget indicator="Another indicator" question="Question?" />,
    );

    expect(screen.getByText("Another indicator")).toBeInTheDocument();
    expect(screen.getByText("Question?")).toBeInTheDocument();
  });
});
