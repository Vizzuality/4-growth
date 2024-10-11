import { FC } from "react";

import { useFormContext } from "react-hook-form";

import { useAtom } from "jotai";

import { FilterSelectForm } from "@/containers/filter/filter-select/filter-select-values";
import {
  currentStepAtom,
  FilterSelectStep,
} from "@/containers/filter/filter-select/store";

import TriangleDown from "@/components/icons/triangle-down";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const operatorToName = {
  "=": "is",
  "!=": "is not",
} as const;

const FilterSelectOperator: FC = () => {
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);
  const form = useFormContext<FilterSelectForm>();
  const selectedOperator = form.watch("operator");

  function toggleView() {
    if (currentStep === FilterSelectStep.valuesOperator) {
      setCurrentStep(FilterSelectStep.values);
    } else {
      setCurrentStep(FilterSelectStep.valuesOperator);
    }
  }

  if (currentStep === FilterSelectStep.valuesOperator) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-slate-100">
        <FormField
          control={form.control}
          name="operator"
          render={({ field }) => (
            <FormItem className="flex-1 space-y-0 overflow-y-auto pt-2">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {Object.keys(operatorToName).map((k) => (
                    <FormItem
                      key={`filter-select-operator-${k}`}
                      className="flex items-center justify-between space-y-0 px-4 py-1"
                    >
                      <FormLabel className="flex-1 translate-y-0 cursor-pointer select-none px-0 text-xs font-medium">
                        {operatorToName[k as keyof typeof operatorToName]}
                      </FormLabel>
                      <FormControl>
                        <RadioGroupItem value={k} />
                      </FormControl>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    );
  }
  return (
    <Button
      type="button"
      variant="clean"
      className="justify-between rounded-none px-4 py-1 transition-colors hover:bg-slate-100"
      onClick={toggleView}
    >
      <span className="text-xs font-medium">
        {operatorToName[selectedOperator]}
      </span>
      <TriangleDown aria-hidden="true" />
    </Button>
  );
};

export default FilterSelectOperator;
