import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SingleValue from "@/containers/widget/single-value";

describe("SingleValue", () => {
  const mockProps = {
    indicator: "Test",
    data: { value: 100, total: 100 },
  };

  it("renders the indicator and value and updates when props change", () => {
    const { rerender } = render(<SingleValue {...mockProps} />);

    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();

    rerender(
      <SingleValue indicator="Test 2" data={{ value: 50, total: 100 }} />,
    );
    expect(screen.getByText("Test 2")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("calculates and applies the correct fill percentage and updates when props change", () => {
    const { container, rerender } = render(<SingleValue {...mockProps} />);
    const fillElement = container.querySelector(
      ".absolute.left-0.top-0.h-full",
    );
    expect(fillElement).toHaveStyle("width: 100%");

    rerender(<SingleValue {...mockProps} data={{ value: 50, total: 100 }} />);

    expect(fillElement).toHaveStyle("width: 50% ");
  });

  it("applies the default background color class when no fill prop is provided", () => {
    const { container } = render(<SingleValue {...mockProps} />);
    const fillElement = container.querySelector(
      ".absolute.left-0.top-0.h-full",
    );
    expect(fillElement).toHaveClass("bg-secondary");
  });

  it("applies the provided background color class when fill prop is given", () => {
    const { container } = render(
      <SingleValue {...mockProps} fill="bg-accent" />,
    );
    const fillElement = container.querySelector(
      ".absolute.left-0.top-0.h-full",
    );
    expect(fillElement).toHaveClass("bg-accent");
  });

  it("handles edge case with 0 total correctly", () => {
    const { container } = render(
      <SingleValue {...mockProps} data={{ value: 0, total: 0 }} />,
    );
    const fillElement = container.querySelector(
      ".absolute.left-0.top-0.h-full",
    );
    expect(fillElement).toHaveStyle("width: 0%");
  });

  it("handles edge case with value greater than total correctly", () => {
    const { container } = render(
      <SingleValue {...mockProps} data={{ value: 150, total: 100 }} />,
    );
    const fillElement = container.querySelector(
      ".absolute.left-0.top-0.h-full",
    );
    expect(fillElement).toHaveStyle("width: 100%");
  });

  it("handles empty data gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { container } = render(
      <SingleValue {...mockProps} data={undefined} />,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "SingleValue - Test: Expected at least 1 data point, but received 0.",
    );
    expect(container.firstChild).toBeNull();
  });
});
