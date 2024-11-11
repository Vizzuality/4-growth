import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Navigation from "@/containers/widget/navigation";

describe("NavigationWidget Component", () => {
  const mockProps = {
    indicator: "Test",
    href: "#",
  };

  it("renders correctly", () => {
    const { container } = render(<Navigation {...mockProps} />);

    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("Explore in Sandbox")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "#");

    expect(container.querySelector("svg")).toHaveClass(
      "lucide lucide-arrow-right",
    );
  });
});
