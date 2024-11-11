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

describe("FilterSelectValues", () => {
  const mockFilter = {
    name: "location-country-region",
    values: ["Austria", "Belgium", "Bulgaria"],
  };
  const mockItems = [
    {
      name: "level-of-reliability:-1-5",
      values: ["1", "2", "3", "4", "5"],
    },
  ].concat(mockFilter);

  const mockOnSubmit = vi.fn();
  const mockProps = {
    items: mockItems,
    defaultValues: [],
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (jotai.useAtomValue as jest.Mock).mockReturnValue(mockFilter);
    (jotai.useAtom as jest.Mock).mockReturnValue([
      FilterSelectStep.values,
      vi.fn(),
    ]);
  });

  it("renders the filter name button", () => {
    render(<FilterSelectValues {...mockProps} />);
    expect(screen.getByText("location-country-region")).toBeInTheDocument();
  });

  it("disables the filter name button when isFixedFilter is true", () => {
    render(<FilterSelectValues {...mockProps} isFixedFilter />);
    expect(
      screen.getByText("location-country-region").closest("button"),
    ).toHaveAttribute("disabled");
  });

  it("only renders the search input when there are more than 15 values", async () => {
    const { rerender } = render(<FilterSelectValues {...mockProps} />);

    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();

    rerender(
      <FilterSelectValues
        {...mockProps}
        items={[
          {
            name: "location-country-region",
            values: [
              "Austria",
              "Belgium",
              "Bulgaria",
              "Croatia",
              "Cyprus",
              "Czechia",
              "Denmark",
              "Estonia",
              "Finland",
              "France",
              "Germany",
              "Greece",
              "Hungary",
              "Ireland",
              "Italy",
              "Latvia",
            ],
          },
        ]}
      />,
    );

    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "Italy" } });

    await waitFor(() => {
      expect(screen.getByText("Italy")).toBeInTheDocument();
      expect(screen.queryByText("Austria")).not.toBeInTheDocument();
      expect(screen.queryByText("Belgium")).not.toBeInTheDocument();
    });
  });

  it("renders the list of values", () => {
    render(<FilterSelectValues {...mockProps} />);
    mockFilter.values.forEach((value) => {
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  it("should unselect all checkboxes if defaultValues is empty", () => {
    render(<FilterSelectValues {...mockProps} defaultValues={[]} />);

    expect(screen.getByLabelText("Austria")).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByLabelText("Belgium")).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("should select the correct checkboxes if defaultValues is passed", () => {
    render(<FilterSelectValues {...mockProps} defaultValues={["Austria"]} />);

    expect(screen.getByLabelText("Belgium")).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByLabelText("Austria")).toHaveAttribute(
      "aria-checked",
      "true",
    );
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

    const value1Checkbox = screen.getByLabelText("Austria");
    const value2Checkbox = screen.getByLabelText("Belgium");

    fireEvent.click(value1Checkbox);
    fireEvent.click(value2Checkbox);

    const applyButton = screen.getByText("Apply");
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        values: ["Austria", "Belgium"],
        operator: "=",
      });
    });
  });
});
