import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NoData from "@/containers/no-data";

vi.mock("@/components/icons/no-data", () => ({
  default: () => <div data-testid="no-data-icon">No data icon</div>,
}));

describe("NoData", () => {
  const defaultDescription = "No data available for this item.";
  it("renders the correct content", () => {
    render(<NoData />);

    expect(screen.getByTestId("no-data-icon")).toBeInTheDocument();
    expect(screen.getByText(defaultDescription)).toBeInTheDocument();
  });

  it("renders with custom description", () => {
    const customDescription = "Custom description";
    render(<NoData description={customDescription} />);

    expect(screen.getByText(customDescription)).toBeInTheDocument();
    expect(screen.queryByText(defaultDescription)).not.toBeInTheDocument();
  });

  it("renders with custom icon", () => {
    const CustomIcon = () => <div data-testid="custom-icon">Custom Icon</div>;
    render(<NoData icon={<CustomIcon />} />);

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("no-data-icon")).not.toBeInTheDocument();
  });
});
