import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterSelectStep } from "@/containers/filter/filter-select/store";
import * as jotai from "jotai";
import { FormProvider, useForm } from "react-hook-form";
import FilterSelectOperator from "@/containers/filter/filter-select/filter-select-operator";

vi.mock("jotai", async () => {
  const actual = await vi.importActual<typeof import("jotai")>("jotai");
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

describe("FilterSelectOperator", () => {
  const renderWithFormProvider = (ui: React.ReactElement) => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      const methods = useForm<{ operator: string }>({
        defaultValues: { operator: "=" },
      });
      return <FormProvider {...methods}>{children}</FormProvider>;
    };

    return render(ui, { wrapper: Wrapper });
  };

  it("renders a button when currentStep is not valuesOperator", () => {
    (jotai.useAtom as jest.Mock).mockReturnValue([
      FilterSelectStep.values,
      vi.fn(),
    ]);

    renderWithFormProvider(<FilterSelectOperator />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("is")).toBeInTheDocument();
    expect(screen.getByTestId("triangle-down-icon")).toBeInTheDocument();
  });

  it("toggles view when button is clicked", () => {
    const setCurrentStepMock = vi.fn();
    (jotai.useAtom as jest.Mock).mockReturnValue([
      FilterSelectStep.values,
      setCurrentStepMock,
    ]);

    renderWithFormProvider(<FilterSelectOperator />);

    fireEvent.click(screen.getByRole("button"));

    expect(setCurrentStepMock).toHaveBeenCalledWith(
      FilterSelectStep.valuesOperator,
    );
  });

  it("renders radio group when currentStep is valuesOperator", () => {
    (jotai.useAtom as jest.Mock).mockReturnValue([
      FilterSelectStep.valuesOperator,
      vi.fn(),
    ]);

    renderWithFormProvider(<FilterSelectOperator />);

    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getByLabelText("is")).toBeInTheDocument();
    expect(screen.getByLabelText("is not")).toBeInTheDocument();
  });

  it("selects the correct radio option", () => {
    (jotai.useAtom as jest.Mock).mockReturnValue([
      FilterSelectStep.valuesOperator,
      vi.fn(),
    ]);

    renderWithFormProvider(<FilterSelectOperator />);

    const is = screen.getByLabelText("is");
    const isNot = screen.getByLabelText("is not");

    expect(is).toHaveAttribute("aria-checked", "true");
    expect(isNot).toHaveAttribute("aria-checked", "false");

    fireEvent.click(isNot);

    expect(is).toHaveAttribute("aria-checked", "false");
    expect(isNot).toHaveAttribute("aria-checked", "true");
  });
});
