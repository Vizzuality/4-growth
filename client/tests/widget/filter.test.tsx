import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Filter from "@/containers/widget/filter";

describe("FilterWidget Component", () => {
  const mockProps = {
    indicator: "Test",
    href: "#",
  };

  it("renders correctly", () => {
    const { container } = render(<Filter {...mockProps} />);

    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("Apply filters")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "#");

    expect(container.querySelector("svg")).toHaveClass(
      "lucide lucide-arrow-right",
    );
  });
});
