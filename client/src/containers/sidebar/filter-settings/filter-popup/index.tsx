import { FC, useState } from "react";

import { PageFilter } from "@shared/dto/widgets/page-filter.entity";
import { useSetAtom } from "jotai";

import { cn } from "@/lib/utils";

import useFilters from "@/hooks/use-filters";

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
  fixedFilter?: PageFilter;
  items: PageFilter[];
}

const FilterItemButton: FC<{
  value: string;

  onClick: (value: string) => void;
}> = ({ value, onClick }) => {
  return (
    <>
      <span className="font-bold">{value}&nbsp;</span>
      <span
        className="h-full p-0 align-text-bottom text-xs transition-all hover:font-extrabold"
        onClick={(e) => {
          e.stopPropagation();
          onClick(value);
        }}
      >
        <span>x</span>
      </span>
    </>
  );
};

const FilterPopup: FC<FilterPopupProps> = ({ name, fixedFilter, items }) => {
  const { filters, addFilter, removeFilterValue } = useFilters();
  const [showPopup, setShowPopup] = useState(false);
  const setShowOverlay = useSetAtom(showOverlayAtom);
  const handleFiltersPopupChange = (open: boolean) => {
    setShowPopup(open);
    setShowOverlay(open);
  };
  const selectedFilter = filters.find((f) => f.name === name);

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
                {name} is{" "}
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
            name
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        className={cn(SIDEBAR_POPOVER_CLASS, "h-[320px]")}
      >
        <FilterSelect
          items={items}
          defaultValues={selectedFilter?.values || []}
          fixedFilter={fixedFilter}
          onSubmit={(values) => {
            addFilter(values);
            handleFiltersPopupChange(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopup;
