"use client";
import { FC } from "react";

import { PageFilter } from "@shared/dto/widgets/page-filter.entity";
import { Provider, useAtomValue } from "jotai";

import FilterSelectName from "@/containers/filter/filter-select/filter-select-name";
import FilterSelectValues, {
  FilterSelectForm,
} from "@/containers/filter/filter-select/filter-select-values";
import {
  AtomsHydrator,
  currentFilterAtom,
  currentStepAtom,
  FilterSelectStep,
} from "@/containers/filter/filter-select/store";

import { Card } from "@/components/ui/card";

export interface FilterSelectProps {
  items: PageFilter[];
  fixedFilter?: PageFilter;
  onSubmit: (values: FilterSelectForm & { name: string }) => void;
}

const FilterSelect: FC<FilterSelectProps> = ({
  items,
  fixedFilter,
  onSubmit,
}) => {
  return (
    <Provider>
      <AtomsHydrator
        currentStep={
          fixedFilter ? FilterSelectStep.values : FilterSelectStep.name
        }
        filter={fixedFilter || null}
      >
        <Card className="relative h-full bg-foreground p-0 text-background">
          <FilterSelectSteps
            fixedFilter={fixedFilter}
            items={items}
            onSubmit={onSubmit}
          />
        </Card>
      </AtomsHydrator>
    </Provider>
  );
};

function FilterSelectSteps({
  fixedFilter,
  items,
  onSubmit,
}: FilterSelectProps) {
  const currentStep = useAtomValue(currentStepAtom);
  const currentFilter = useAtomValue(currentFilterAtom);

  if (currentStep === FilterSelectStep.name) {
    return <FilterSelectName items={items} />;
  }

  return (
    <FilterSelectValues
      isFixedFilter={!!fixedFilter}
      onSubmit={(v) => onSubmit({ ...v, name: currentFilter?.name as string })}
    />
  );
}

export default FilterSelect;
