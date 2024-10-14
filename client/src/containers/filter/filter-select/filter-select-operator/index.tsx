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
                      className="flex h-10 items-center justify-between space-y-0 pr-3 transition-colors hover:bg-slate-200"
                    >
                      <FormLabel className="flex-1 translate-y-0 cursor-pointer select-none py-4 pl-3 pr-0 text-xs font-medium">
                        {operatorToName[k as keyof typeof operatorToName]}
                      </FormLabel>
                      <FormControl>
                        <RadioGroupItem value={k} className="text-navy-700" />
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
      className="justify-between rounded-none px-3 py-4 transition-colors hover:bg-slate-100"
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
