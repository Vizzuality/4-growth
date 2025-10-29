import { FC } from "react";

import { PageFilter } from "@shared/dto/widgets/page-filter.entity";
import { useSetAtom } from "jotai";

import {
  currentFilterAtom,
  currentStepAtom,
  FilterSelectStep,
} from "@/containers/filter/filter-select/store";
import SearchableList from "@/containers/searchable-list";

const FilterSelectName: FC<{ items: PageFilter[] }> = ({ items }) => {
  const setCurrentFilter = useSetAtom(currentFilterAtom);
  const setCurrentStep = useSetAtom(currentStepAtom);

  return (
    <SearchableList
      items={items}
      itemKey="label"
      onItemClick={(filter) => {
        setCurrentFilter(filter);
        setCurrentStep(FilterSelectStep.values);
      }}
      maxHeight={220}
    />
  );
};

export default FilterSelectName;
