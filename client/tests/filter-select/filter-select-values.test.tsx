import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as jotai from "jotai";
import { FilterSelectStep } from "@/containers/filter/filter-select/store";
import FilterSelectValues from "@/containers/filter/filter-select/filter-select-values";

vi.mock("jotai", async () => {
  const actual = await vi.importActual<typeof jotai>("jotai");
  return {
    ...actual,
    useAtom: vi.fn(),
    useAtomValue: vi.fn(),
  };
});

vi.mock("@/containers/filter/filter-select/filter-select-operator", () => ({
  default: () => (
    <div data-testid="filter-select-operator">FilterSelectOperator</div>
  ),
}));

describe("FilterSelectValues", () => {
  const mockFilter = {
    name: "sector",
    values: ["Agriculture", "Forestry", "Both"],
  };

  const mockOnSubmit = vi.fn();
  const mockProps = {
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (jotai.useAtomValue as jest.Mock).mockReturnValue(mockFilter);
    (jotai.useAtom as jest.Mock).mockReturnValue([
      FilterSelectStep.valuesList,
      vi.fn(),
    ]);
  });

  it("renders the filter name button", () => {
    render(<FilterSelectValues {...mockProps} />);
    expect(screen.getByText("sector")).toBeInTheDocument();
  });

  it("disables the filter name button when isFixedFilter is true", () => {
    render(<FilterSelectValues {...mockProps} isFixedFilter />);
    expect(screen.getByText("sector").closest("button")).toHaveAttribute(
      "disabled",
    );
  });

  it("renders the FilterSelectOperator component", () => {
    render(<FilterSelectValues {...mockProps} />);
    expect(screen.getByTestId("filter-select-operator")).toBeInTheDocument();
  });

  it("changes step to valuesList when “Select values” button is clicked", () => {
    const setCurrentStepMock = vi.fn();
    (jotai.useAtom as jest.Mock).mockReturnValue([
      FilterSelectStep.values,
      setCurrentStepMock,
    ]);
    render(<FilterSelectValues {...mockProps} />);

    const selectValuesButton = screen.getByText("“Select values”");
    fireEvent.click(selectValuesButton);

    expect(setCurrentStepMock).toHaveBeenCalledWith(
      FilterSelectStep.valuesList,
    );
  });

  it("renders the search input", () => {
    render(<FilterSelectValues {...mockProps} />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("renders the list of values", () => {
    render(<FilterSelectValues {...mockProps} />);
    mockFilter.values.forEach((value) => {
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  it("filters values when searching", async () => {
    render(<FilterSelectValues {...mockProps} />);
    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "For" } });

    await waitFor(() => {
      expect(screen.getByText("Forestry")).toBeInTheDocument();
      expect(screen.queryByText("Agriculture")).not.toBeInTheDocument();
      expect(screen.queryByText("Both")).not.toBeInTheDocument();
    });
  });

  it("toggles select all checkbox", () => {
    render(<FilterSelectValues {...mockProps} />);
    const selectAllCheckbox = screen.getByLabelText("Select All");

    expect(selectAllCheckbox).toHaveAttribute("aria-checked", "false");
    mockFilter.values.forEach((value) => {
      expect(screen.getByLabelText(value)).toHaveAttribute(
        "aria-checked",
        "false",
      );
    });

    fireEvent.click(selectAllCheckbox);
    expect(selectAllCheckbox).toHaveAttribute("aria-checked", "true");
    mockFilter.values.forEach((value) => {
      expect(screen.getByLabelText(value)).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });
  });

  it("submits the form with selected values", async () => {
    render(<FilterSelectValues {...mockProps} />);

    const value1Checkbox = screen.getByLabelText("Agriculture");
    const value2Checkbox = screen.getByLabelText("Forestry");

    fireEvent.click(value1Checkbox);
    fireEvent.click(value2Checkbox);

    const applyButton = screen.getByText("Apply");
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        values: ["Agriculture", "Forestry"],
        operator: "=",
      });
    });
  });
});
