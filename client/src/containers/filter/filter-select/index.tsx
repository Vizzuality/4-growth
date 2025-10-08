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

export interface FilterSelectProps {
  items: PageFilter[];
  defaultValues: string[];
  fixedFilter?: PageFilter;
  onSubmit: (values: FilterSelectForm & { name: string }) => void;
}

const FilterSelect: FC<FilterSelectProps> = ({
  items,
  defaultValues,
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
        <FilterSelectSteps
          defaultValues={defaultValues}
          fixedFilter={fixedFilter}
          items={items}
          onSubmit={onSubmit}
        />
      </AtomsHydrator>
    </Provider>
  );
};

function FilterSelectSteps({
  fixedFilter,
  defaultValues,
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
      items={items}
      defaultValues={defaultValues}
      isFixedFilter={!!fixedFilter}
      onSubmit={(v) => {
        onSubmit({ ...v, name: currentFilter?.name as string });
      }}
    />
  );
}

export default FilterSelect;
