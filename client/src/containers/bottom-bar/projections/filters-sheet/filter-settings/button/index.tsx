import { FC, useState } from "react";

import { ProjectionFilter } from "@shared/dto/projections/projection-filter.entity";

import { useFilterSettings } from "@/containers/bottom-bar/projections/filters-sheet/filter-settings/hooks";
import FilterSelect from "@/containers/filter/filter-select";
import FilterItemButton from "@/containers/sidebar/filter-settings/button";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

interface Props {
  allFilters: ProjectionFilter[];
  fixedFilter?: ProjectionFilter;
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

  return (
    <>
      <Button
        variant="clean"
        className="inline-block h-full w-full whitespace-pre-wrap rounded-none px-4 py-3.5 text-left font-normal transition-colors hover:bg-secondary"
        onClick={() => setShowFilterSelect(true)}
      >
        {selectedFilter ? (
          <>
            <span className="inline-block">
              {label?.selected ??
                allFilters.find((f) => f.name === selectedFilter?.name)
                  ?.label}{" "}
              <FilterItemButton
                value={selectedFilter.values[0]}
                onClick={(value) => removeFilterValue(name, value)}
              />
            </span>
            <ul>
              {selectedFilter.values.slice(1).map((v) => (
                <li key={`selected-filter-${v}`}>
                  <FilterItemButton
                    value={v}
                    onClick={(value) => removeFilterValue(name, value)}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : (
          label?.unSelected || name
        )}
      </Button>
      <Sheet open={showFilterSelect} onOpenChange={setShowFilterSelect}>
        <SheetContent
          className="max-h-fit w-screen justify-between rounded-t-2xl bg-foreground p-0 text-background"
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
