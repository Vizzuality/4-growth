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

const BottomBar: FC = () => {
  const { filters, addFilter, removeFilterValue } = useFilters();

  return (
    <Sheet>
      <div className="bottom-0 left-0 flex md:hidden">
        <SheetTrigger asChild>
          <Button className="w-full">Filters</Button>
        </SheetTrigger>
      </div>
      <SheetContent className="h-screen w-screen" side="bottom">
        <SheetHeader className="sr-only">
          <SheetTitle></SheetTitle>
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
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BottomBar;
