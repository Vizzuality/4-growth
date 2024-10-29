import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NoData from "@/containers/no-data";

vi.mock("@/components/icons/no-data", () => ({
  default: () => <div data-testid="no-data-icon">No data icon</div>,
}));

describe("NoData", () => {
  it("renders the correct content", () => {
    render(<NoData />);

    expect(screen.getByTestId("no-data-icon")).toBeInTheDocument();
    expect(
      screen.getByText("No data available for this item."),
    ).toBeInTheDocument();
  });
});
