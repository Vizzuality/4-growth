"use client";
import { FC, useCallback } from "react";

import { useAtom } from "jotai";

import { ADD_FILTER_MODE } from "@/lib/constants";
import { addFilterQueryParam, removeFilterQueryParamValue } from "@/lib/utils";

import { FilterQueryParam } from "@/hooks/use-filters";

import FilterSettings from "@/containers/sidebar/filter-settings";
import { SURVEY_ANALYSIS_DEFAULT_FILTERS } from "@/containers/sidebar/filter-settings/constants";
import { sandboxFiltersAtom } from "@/containers/sidebar/store";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const FiltersSheet: FC = () => {
  const [filters, setFilters] = useAtom(sandboxFiltersAtom);
  const addFilter = useCallback(
    (newFilter: FilterQueryParam) => {
      if (newFilter.values.length) {
        setFilters(
          addFilterQueryParam(filters, newFilter, ADD_FILTER_MODE.REPLACE),
        );
      } else if (newFilter.values.length === 0) {
        setFilters(filters.filter((filter) => filter.name !== newFilter.name));
      }
    },
    [filters, setFilters],
  );

  const removeFilterValue = useCallback(
    (name: string, valueToRemove: string) => {
      setFilters(removeFilterQueryParamValue(filters, name, valueToRemove));
    },
    [filters, setFilters],
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full">Filters</Button>
      </SheetTrigger>
      <SheetContent className="h-screen w-screen bg-navy-900" side="bottom">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="py-3.5">
          <FilterSettings
            type="surveyAnalysis"
            defaultFilters={SURVEY_ANALYSIS_DEFAULT_FILTERS}
            filterQueryParams={filters}
            onAddFilter={addFilter}
            onRemoveFilterValue={removeFilterValue}
            withDataBreakdown
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FiltersSheet;
