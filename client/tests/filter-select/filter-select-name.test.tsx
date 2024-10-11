import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FilterSelectName from "@/containers/filter/filter-select/filter-select-name";

describe("FilterSelectName", () => {
  const mockItems = [
    {
      name: "sector",
      values: ["Agriculture", "Forestry", "Both"],
    },
    {
      name: "level-of-reliability:-1-5",
      values: ["1", "2", "3", "4", "5"],
    },
  ];

  it("renders the search input", () => {
    render(<FilterSelectName items={mockItems} />);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("renders the search icon", () => {
    render(<FilterSelectName items={mockItems} />);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("renders a list of all filters by default", () => {
    render(<FilterSelectName items={mockItems} />);

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(mockItems.length);
    mockItems.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  it("filters the list when searching and resets the list when search input is cleared", () => {
    render(<FilterSelectName items={mockItems} />);
    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "level" } });

    expect(screen.getByText("level-of-reliability:-1-5")).toBeInTheDocument();
    expect(screen.queryByText("sector")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "" } });

    mockItems.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });
});
