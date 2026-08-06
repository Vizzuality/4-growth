import { FC, useState } from "react";

import { PageFilter } from "@shared/dto/widgets/page-filter.entity";
import { useSetAtom } from "jotai";

import {
  DATA_SOURCE_FILTER_NAME,
  getDataSourceOptionLabel,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

import { FilterQueryParam } from "@/hooks/use-filters";

import DataSourceInfoButton from "@/containers/filter/data-source-info";
import FilterSelect from "@/containers/filter/filter-select";
import { showOverlayAtom } from "@/containers/overlay/store";
import FilterItemButton from "@/containers/sidebar/filter-settings/button";
import DataSourceFilterLabel from "@/containers/sidebar/filter-settings/data-source-label";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SIDEBAR_POPOVER_CLASS } from "@/constants";

interface FilterPopupProps {
  name: string;
  filters: PageFilter[];
  filterQueryParams: FilterQueryParam[];
  onAddFilter: (newFilter: FilterQueryParam) => void;
  onRemoveFilterValue: (name: string, valueToRemove: string) => void;
  label?: {
    selected: string;
    unSelected: string;
  };
  fixedFilter?: PageFilter;
}

const FilterPopup: FC<FilterPopupProps> = ({
  name,
  filterQueryParams,
  label,
  fixedFilter,
  filters,
  onAddFilter,
  onRemoveFilterValue,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const setShowOverlay = useSetAtom(showOverlayAtom);
  const handleFiltersPopupChange = (open: boolean) => {
    setShowPopup(open);
    setShowOverlay(open);
  };
  const selectedFilter = filterQueryParams.find((f) => f.name === name);
  const isDataSource = name === DATA_SOURCE_FILTER_NAME;
  const isComparingSources =
    isDataSource && (selectedFilter?.values.length ?? 0) > 1;

  return (
    <div className="relative">
      <Popover onOpenChange={handleFiltersPopupChange} open={showPopup} modal>
        <PopoverTrigger asChild>
          <Button
            variant="clean"
            className={cn(
              "inline-block h-full w-full whitespace-pre-wrap rounded-none px-4 py-3.5 text-left font-normal transition-colors hover:bg-secondary",
              isDataSource && "pr-10",
            )}
          >
            {selectedFilter ? (
              <>
                <span className="inline-block">
                  {label?.selected ??
                    filters.find((f) => f.name === selectedFilter?.name)
                      ?.label}{" "}
                  {isComparingSources ? (
                    <DataSourceFilterLabel values={selectedFilter.values} />
                  ) : (
                    <FilterItemButton
                      value={selectedFilter.values[0]}
                      displayValue={
                        isDataSource
                          ? getDataSourceOptionLabel(selectedFilter.values)
                          : undefined
                      }
                      removable={!isDataSource}
                      onClick={(value) => onRemoveFilterValue(name, value)}
                    />
                  )}
                </span>
                {!isDataSource && (
                  <ul>
                    {selectedFilter.values.slice(1).map((v) => (
                      <li key={`selected-filter-${v}`}>
                        <FilterItemButton
                          value={v}
                          onClick={(value) => onRemoveFilterValue(name, value)}
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
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="bottom"
          className={SIDEBAR_POPOVER_CLASS}
        >
          <FilterSelect
            items={filters}
            defaultValues={selectedFilter?.values || []}
            fixedFilter={fixedFilter}
            onSubmit={(values) => {
              onAddFilter(values);
              handleFiltersPopupChange(false);
            }}
            maxHeight={220}
          />
        </PopoverContent>
      </Popover>
      {isDataSource && (
        <DataSourceInfoButton className="absolute right-4 top-1/2 -translate-y-1/2 text-white" />
      )}
    </div>
  );
};

export default FilterPopup;
