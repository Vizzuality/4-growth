import { FC, useId, useState } from "react";

import { PageFilter } from "@shared/dto/widgets/page-filter.entity";
import { useSetAtom } from "jotai";

import { SECTOR_FILTER_NAME } from "@/lib/constants";

import { FilterQueryParam, isSectorLocked } from "@/hooks/use-filters";

import {
  FilterRowButton,
  FilterRowFrame,
} from "@/containers/filter/filter-row";
import FilterSelect from "@/containers/filter/filter-select";
import { showOverlayAtom } from "@/containers/overlay/store";

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
  const selectedFilter = filterQueryParams.find((f) => f.name === name);
  const locked =
    name === SECTOR_FILTER_NAME && isSectorLocked(filterQueryParams);
  const reasonId = useId();
  const handleFiltersPopupChange = (open: boolean) => {
    if (locked && open) return;

    setShowPopup(open);
    setShowOverlay(open);
  };

  return (
    <FilterRowFrame name={name} locked={locked} reasonId={reasonId}>
      <Popover onOpenChange={handleFiltersPopupChange} open={showPopup} modal>
        <PopoverTrigger asChild>
          <FilterRowButton
            name={name}
            filters={filters}
            selectedFilter={selectedFilter}
            locked={locked}
            reasonId={reasonId}
            label={label}
            onRemoveFilterValue={onRemoveFilterValue}
          />
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
    </FilterRowFrame>
  );
};

export default FilterPopup;
