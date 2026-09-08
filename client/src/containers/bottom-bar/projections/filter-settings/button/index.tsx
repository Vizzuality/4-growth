import { FC, useId, useState } from "react";

import { PageFilter } from "@shared/dto/widgets/page-filter.entity";

import { SECTOR_FILTER_NAME } from "@/lib/constants";

import { isSectorLocked } from "@/hooks/use-filters";

import { useFilterSettings } from "@/containers/bottom-bar/filters-sheet/hooks";
import {
  FilterRowButton,
  FilterRowFrame,
} from "@/containers/filter/filter-row";
import FilterSelect from "@/containers/filter/filter-select";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

interface Props {
  allFilters: PageFilter[];
  fixedFilter?: PageFilter;
  name: string;
  label?: {
    selected: string;
    unSelected: string;
  };
}

const FilterSettingsButton: FC<Props> = ({
  allFilters,
  name,
  label,
  fixedFilter,
}) => {
  const [showFilterSelect, setShowFilterSelect] = useState<boolean>(false);
  const { filters, removeFilterValue, addFilter } = useFilterSettings();
  const selectedFilter = filters.find((f) => f.name === name);
  const locked = name === SECTOR_FILTER_NAME && isSectorLocked(filters);
  const reasonId = useId();

  return (
    <>
      <FilterRowFrame name={name} locked={locked} reasonId={reasonId}>
        <FilterRowButton
          name={name}
          filters={allFilters}
          selectedFilter={selectedFilter}
          locked={locked}
          reasonId={reasonId}
          label={label}
          onRemoveFilterValue={removeFilterValue}
          onClick={() => {
            if (locked) return;

            setShowFilterSelect(true);
          }}
        />
      </FilterRowFrame>
      <Sheet open={showFilterSelect} onOpenChange={setShowFilterSelect}>
        <SheetContent
          className="flex h-full max-h-[70%] w-screen flex-col justify-between overflow-hidden rounded-t-2xl bg-slate-100 p-0 text-background"
          side="bottom"
          hideCloseButton
        >
          <SheetHeader className="sr-only">
            <SheetTitle className="sr-only">Filters</SheetTitle>
            <SheetDescription className="sr-only">Filters</SheetDescription>
          </SheetHeader>
          <FilterSelect
            items={allFilters}
            defaultValues={selectedFilter?.values || []}
            fixedFilter={fixedFilter}
            onSubmit={(values) => {
              addFilter(values);
              setShowFilterSelect(false);
            }}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default FilterSettingsButton;
