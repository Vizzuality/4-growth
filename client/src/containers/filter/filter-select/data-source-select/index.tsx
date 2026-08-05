import { FC, useState } from "react";

import { useAtomValue, useSetAtom } from "jotai";

import {
  DATA_SOURCE_OPTIONS,
  DEFAULT_DATA_SOURCE_VALUES,
} from "@/lib/constants";

import { FilterSelectForm } from "@/containers/filter/filter-select/filter-select-values";
import {
  currentFilterAtom,
  currentStepAtom,
  FilterSelectStep,
} from "@/containers/filter/filter-select/store";

import TriangleDown from "@/components/icons/triangle-down";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface DataSourceSelectProps {
  defaultValues: string[];
  isFixedFilter?: boolean;
  maxHeight?: number;
  onSubmit: (values: FilterSelectForm) => void;
}

const toOptionKey = (values: string[]) => [...values].sort().join("|");

const DataSourceSelect: FC<DataSourceSelectProps> = ({
  defaultValues,
  isFixedFilter,
  maxHeight,
  onSubmit,
}) => {
  const filter = useAtomValue(currentFilterAtom);
  const setCurrentStep = useSetAtom(currentStepAtom);
  const [selectedKey, setSelectedKey] = useState(() =>
    toOptionKey(defaultValues.length ? defaultValues : DEFAULT_DATA_SOURCE_VALUES),
  );

  return (
    <div className="flex h-full flex-col">
      <Button
        type="button"
        variant="clean"
        className="justify-between rounded-none px-3 py-4 transition-colors hover:bg-slate-100 disabled:bg-transparent disabled:text-inherit"
        onClick={() => {
          setCurrentStep(FilterSelectStep.name);
        }}
        disabled={isFixedFilter}
      >
        <span className="text-xs font-medium">{filter?.label}</span>
        <TriangleDown aria-hidden="true" />
      </Button>
      <div className="flex h-full min-h-0 flex-col bg-slate-100">
        <ScrollArea maxHeight={maxHeight}>
          <RadioGroup
            className="gap-0"
            value={selectedKey}
            onValueChange={(key) => {
              const option = DATA_SOURCE_OPTIONS.find(
                (o) => toOptionKey(o.values) === key,
              );

              if (!option) return;

              setSelectedKey(key);
              onSubmit({ values: [...option.values], operator: "=" });
            }}
          >
            {DATA_SOURCE_OPTIONS.map((option) => {
              const optionId = `data-source-option-${toOptionKey(option.values)}`;

              return (
                <div
                  key={optionId}
                  className="flex h-10 items-center justify-between gap-2 pr-3 transition-colors hover:bg-slate-200"
                >
                  <Label
                    htmlFor={optionId}
                    className="flex-1 cursor-pointer select-none py-4 pl-3 pr-0 text-xs font-medium"
                  >
                    {option.label}
                  </Label>
                  <RadioGroupItem
                    id={optionId}
                    variant="secondary"
                    value={toOptionKey(option.values)}
                    className="data-[state=unchecked]:hidden"
                  />
                </div>
              );
            })}
          </RadioGroup>
        </ScrollArea>
      </div>
    </div>
  );
};

export default DataSourceSelect;
