import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchableList from "@/containers/searchable-list";

describe("SearchableList", () => {
  const mockItems = [
    { id: 1, name: "France" },
    { id: 2, name: "Spain" },
    { id: 3, name: "The Netherlands" },
  ];

  const mockOnItemClick = vi.fn();
  const mockProps = {
    items: mockItems,
    itemKey: "name",
    onItemClick: mockOnItemClick,
  } as const;

  it("renders all items initially", () => {
    render(<SearchableList {...mockProps} />);

    mockItems.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  it("calls onItemClick when an item is clicked", () => {
    render(<SearchableList {...mockProps} />);

    fireEvent.click(screen.getByText("Spain"));
    expect(mockOnItemClick).toHaveBeenCalledWith(mockItems[1]);
  });

  it("filters items based on search input", async () => {
    render(<SearchableList {...mockProps} />);

    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "France" } });

    expect(screen.getByText("France")).toBeInTheDocument();
    expect(screen.queryByText("Spain")).not.toBeInTheDocument();
    expect(screen.queryByText("The Netherlands")).not.toBeInTheDocument();
  });

  it("renders no items when search term matches nothing", () => {
    render(<SearchableList {...mockProps} />);

    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "Germany" } });

    mockItems.forEach((item) => {
      expect(screen.queryByText(item.name)).not.toBeInTheDocument();
    });
  });

  it("renders all items when search input is cleared", () => {
    render(<SearchableList {...mockProps} />);

    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "France" } });
    fireEvent.change(searchInput, { target: { value: "" } });

    mockItems.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });
});
