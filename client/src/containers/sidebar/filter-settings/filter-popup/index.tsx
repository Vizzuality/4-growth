import { FC, useState } from "react";

import { PageFilter } from "@shared/dto/widgets/page-filter.entity";
import { useSetAtom } from "jotai";
import { CircleXIcon } from "lucide-react";

import { FilterQueryParam } from "@/hooks/use-filters";

import FilterSelect from "@/containers/filter/filter-select";
import { showOverlayAtom } from "@/containers/overlay/store";

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

const FilterItemButton: FC<{
  value: string;

  onClick: (value: string) => void;
}> = ({ value, onClick }) => {
  return (
    <span className="inline-flex items-end gap-2">
      <span className="font-bold">{value}&nbsp;</span>
      <CircleXIcon
        className="h-4 w-4 transition-colors hover:text-white/80"
        onClick={(e) => {
          e.stopPropagation();
          onClick(value);
        }}
      />
    </span>
  );
};

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

  return (
    <Popover onOpenChange={handleFiltersPopupChange} open={showPopup}>
      <PopoverTrigger asChild>
        <Button
          variant="clean"
          className="inline-block h-full w-full whitespace-pre-wrap rounded-none px-4 py-3.5 text-left font-normal transition-colors hover:bg-secondary"
        >
          {selectedFilter ? (
            <>
              <span className="inline-block">
                {label?.selected || name} is{" "}
                <FilterItemButton
                  value={selectedFilter.values[0]}
                  onClick={(value) => onRemoveFilterValue(name, value)}
                />
              </span>
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
        />
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopup;
