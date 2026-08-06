import { FC, useState } from "react";

import { PageFilter } from "@shared/dto/widgets/page-filter.entity";

import {
  DATA_SOURCE_FILTER_NAME,
  getDataSourceOptionLabel,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

import { useFilterSettings } from "@/containers/bottom-bar/filters-sheet/hooks";
import DataSourceInfoButton from "@/containers/filter/data-source-info";
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
  const isDataSource = name === DATA_SOURCE_FILTER_NAME;

  return (
    <>
      <div className="relative">
        <Button
          variant="clean"
          className={cn(
            "inline-block h-full w-full whitespace-pre-wrap rounded-none px-4 py-3.5 text-left font-normal transition-colors hover:bg-secondary",
            isDataSource && "pr-10",
          )}
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
                  displayValue={
                    isDataSource
                      ? getDataSourceOptionLabel(selectedFilter.values)
                      : undefined
                  }
                  removable={!isDataSource}
                  onClick={(value) => removeFilterValue(name, value)}
                />
              </span>
              {!isDataSource && (
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
              )}
            </>
          ) : (
            label?.unSelected || name
          )}
        </Button>
        {isDataSource && (
          <DataSourceInfoButton className="absolute right-4 top-1/2 -translate-y-1/2 text-white" />
        )}
      </div>
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
