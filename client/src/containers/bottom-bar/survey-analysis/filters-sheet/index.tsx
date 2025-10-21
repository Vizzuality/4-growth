"use client";
import { FC } from "react";

import { ADD_FILTER_MODE } from "@/lib/constants";

import useFilters from "@/hooks/use-filters";

import FilterSettings from "@/containers/sidebar/filter-settings";
import { SURVEY_ANALYSIS_DEFAULT_FILTERS } from "@/containers/sidebar/filter-settings/constants";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const FiltersSheet: FC<{ withDataBreakdown?: boolean }> = ({
  withDataBreakdown,
}) => {
  const { filters, addFilter, removeFilterValue } = useFilters();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full">Filters</Button>
      </SheetTrigger>
      <SheetContent className="h-full w-screen bg-navy-900" side="bottom">
        <SheetHeader className="text-left">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="py-3.5">
          <FilterSettings
            type="surveyAnalysis"
            defaultFilters={SURVEY_ANALYSIS_DEFAULT_FILTERS}
            filterQueryParams={filters}
            onAddFilter={(newFilter) =>
              addFilter(newFilter, ADD_FILTER_MODE.REPLACE)
            }
            onRemoveFilterValue={removeFilterValue}
            withDataBreakdown={withDataBreakdown}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FiltersSheet;
