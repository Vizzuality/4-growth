"use client";
import { FC, useEffect, useState } from "react";

import { useAtom } from "jotai";

import useFilters from "@/hooks/use-filters";

import FilterSettings from "@/containers/bottom-bar/projections/filters-sheet/filter-settings";
import { FilterSettingsAtom } from "@/containers/bottom-bar/projections/filters-sheet/filter-settings/store";
import { PROJECTIONS_DEFAULT_FILTERS } from "@/containers/sidebar/filter-settings/constants";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const FiltersSheet: FC = () => {
  const [open, setOpen] = useState(false);
  const { filters, setFilters } = useFilters();
  const [newFilters, setNewFilters] = useAtom(FilterSettingsAtom);
  const handleSubmitButtonClick = () => {
    setFilters(newFilters);
    setOpen(false);
    setNewFilters([]);
  };

  useEffect(() => {
    setNewFilters(filters);
  }, [filters, setNewFilters]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="w-full">Filters</Button>
      </SheetTrigger>
      <SheetContent
        className="h-full max-h-[80%] w-screen justify-between rounded-t-2xl border-t-navy-900 bg-navy-900 px-0 pb-0"
        side="bottom"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="px-4 text-left text-base">Filters</SheetTitle>
          <SheetDescription className="sr-only">Filters</SheetDescription>
        </SheetHeader>
        <FilterSettings defaultFilters={PROJECTIONS_DEFAULT_FILTERS} />
        <div className="absolute bottom-0 left-0 w-full">
          <Button className="w-full" onClick={handleSubmitButtonClick}>
            Apply
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FiltersSheet;
