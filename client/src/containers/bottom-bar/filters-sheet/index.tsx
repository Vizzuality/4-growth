"use client";
import { FC, PropsWithChildren, useEffect, useState } from "react";

import { useAtom } from "jotai";
import { useQueryState } from "nuqs";

import useProjectionsCategoryFilter from "@/hooks/use-category-filter";
import useFilters from "@/hooks/use-filters";

import {
  breakdownAtom,
  FilterSettingsAtom,
} from "@/containers/bottom-bar/filters-sheet/store";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const FiltersSheet: FC<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { filters, setFilters } = useFilters();
  const [newFilters, setNewFilters] = useAtom(FilterSettingsAtom);
  const [newBreakdown, setNewBreakdown] = useAtom(breakdownAtom);
  const [breakdown, setBreakdown] = useQueryState("breakdown");
  const { isCategorySelected } = useProjectionsCategoryFilter();
  const handleSubmitButtonClick = () => {
    setFilters(newFilters);
    setBreakdown(newBreakdown);

    handleClose();
  };
  const handleClose = () => {
    setOpen(false);
    setNewFilters([]);
    setNewBreakdown(null);
  };

  useEffect(() => {
    if (open) {
      setNewFilters(filters);

      if (breakdown) {
        setNewBreakdown(breakdown);
      }
    }
  }, [open, filters, breakdown, setNewBreakdown, setNewFilters]);

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (open) {
          setOpen(open);
        } else {
          handleClose();
        }
      }}
    >
      <SheetTrigger asChild>
        <Button disabled={!isCategorySelected} className="w-full">
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex h-full max-h-[80%] w-screen flex-col justify-between rounded-t-2xl border-t-navy-900 bg-navy-900 px-0 pb-0"
        side="bottom"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="px-4 text-left text-base">Filters</SheetTitle>
          <SheetDescription className="sr-only">Filters</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full">{children}</ScrollArea>
        <Button className="w-full" onClick={handleSubmitButtonClick}>
          Apply
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default FiltersSheet;
