import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as jotai from "jotai";
import DataSourceSelect from "@/containers/filter/filter-select/data-source-select";

vi.mock("jotai", async () => {
  const actual = await vi.importActual<typeof jotai>("jotai");
  return {
    ...actual,
    useAtomValue: vi.fn(),
    useSetAtom: vi.fn(),
  };
});

describe("DataSourceSelect", () => {
  const mockOnSubmit = vi.fn();
  const mockProps = {
    defaultValues: ["survey"],
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (jotai.useAtomValue as jest.Mock).mockReturnValue({
      name: "data-source",
      label: "Data source",
      values: ["survey", "automated"],
    });
    (jotai.useSetAtom as jest.Mock).mockReturnValue(vi.fn());
  });

  it("submits both values as a single filter when the combined option is chosen", async () => {
    render(<DataSourceSelect {...mockProps} />);

    fireEvent.click(screen.getByLabelText("Survey and Automated"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        values: ["survey", "automated"],
        operator: "=",
      });
    });
  });

  it("submits a single value when an individual source is chosen", async () => {
    render(<DataSourceSelect {...mockProps} />);

    fireEvent.click(screen.getByLabelText("Automated web data"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        values: ["automated"],
        operator: "=",
      });
    });
  });

  it("applies on selection without an Apply button", () => {
    render(<DataSourceSelect {...mockProps} />);

    expect(screen.queryByText("Apply")).not.toBeInTheDocument();
  });
});
