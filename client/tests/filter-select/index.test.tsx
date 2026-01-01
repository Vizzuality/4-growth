import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import FilterSelect, {
  FilterSelectProps,
} from "@/containers/filter/filter-select";
import { FilterSelectValuesProps } from "@/containers/filter/filter-select/filter-select-values";

vi.mock("@/containers/filter/filter-select/filter-select-name", () => ({
  default: () => <div data-testid="filter-select-name">FilterSelectName</div>,
}));

vi.mock("@/containers/filter/filter-select/filter-select-values", () => ({
  default: ({ onSubmit }: FilterSelectValuesProps) => (
    <div data-testid="filter-select-values">
      <button onClick={() => onSubmit({ values: ["1"], operator: "=" })}>
        Apply
      </button>
    </div>
  ),
}));

describe("FilterSelect", () => {
  const mockOnSubmit = vi.fn();
  const mockProps: FilterSelectProps = {
    defaultValues: [],
    items: [
      {
        name: "sector",
        label: "Sector",
        values: ["Agriculture", "Forestry", "Both"],
      },
    ],
    onSubmit: mockOnSubmit,
  };
  const fixedFilter = {
    name: "level-of-reliability:-1-5",
    label: "Level of Reliability (1-5)",
    values: ["1", "2", "3", "4", "5"],
  };

  it("renders only FilterSelectName by default", () => {
    render(<FilterSelect {...mockProps} />);
    expect(screen.getByTestId("filter-select-name")).toBeInTheDocument();
    expect(
      screen.queryByTestId("filter-select-values"),
    ).not.toBeInTheDocument();
  });

  it("renders FilterSelectValues when fixedFilter is provided", () => {
    render(<FilterSelect {...mockProps} fixedFilter={fixedFilter} />);
    expect(screen.getByTestId("filter-select-values")).toBeInTheDocument();
    expect(screen.queryByTestId("filter-select-name")).not.toBeInTheDocument();
  });

  it("calls onSubmit with correct data when form is submitted", () => {
    render(<FilterSelect {...mockProps} fixedFilter={fixedFilter} />);

    const submitButton = screen.getByText("Apply");
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "level-of-reliability:-1-5",
      values: ["1"],
      operator: "=",
    });
  });
});
