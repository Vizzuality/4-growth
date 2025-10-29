import { FC, useState } from "react";

import { BaseWidget } from "@shared/dto/widgets/base-widget.entity";
import { useAtom, useSetAtom } from "jotai";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import { breakdownAtom } from "@/containers/bottom-bar/filters-sheet/store";
import { showOverlayAtom } from "@/containers/overlay/store";
import SearchableList from "@/containers/searchable-list";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const EXCLUDED_WIDGET_INDICATORS = [
  "total-countries",
  "total-surveys",
  "adoption-of-technology-by-country",
];

const BreakdownSelector: FC = () => {
  const [breakdown, setBreakdown] = useAtom(breakdownAtom);
  const { data } = client.widgets.getWidgets.useQuery(
    queryKeys.widgets.all.queryKey,
    { query: {} },
    { select: (res) => res.body.data },
  );
  const [showIndicators, setShowIndicators] = useState(false);
  const setshowOverlay = useSetAtom(showOverlayAtom);
  const widgets = (data ?? []) as BaseWidget[];

  return (
    <Sheet
      open={showIndicators}
      onOpenChange={(o) => {
        setShowIndicators(o);
        setshowOverlay(o);
      }}
    >
      <SheetTrigger>
        <Button
          variant="clean"
          className="inline-block h-full w-full whitespace-pre-wrap rounded-none px-4 py-3.5 text-left font-normal transition-colors hover:bg-secondary"
        >
          {breakdown ? (
            <>
              <span>Breakdown by&nbsp;</span>
              <span className="font-bold">
                {`${widgets.find((w) => w.indicator === breakdown)?.title}`}
                &nbsp;
              </span>
              <span
                className="h-full p-0 align-text-bottom text-xs transition-all hover:font-extrabold"
                onClick={(e) => {
                  e.stopPropagation();
                  setBreakdown(null);
                }}
              >
                x
              </span>
            </>
          ) : (
            <span>Add a data breakdown</span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex h-full max-h-[70%] w-screen flex-col justify-between overflow-hidden rounded-t-2xl bg-slate-100 p-0 text-background"
        side="bottom"
        hideCloseButton
      >
        <SheetHeader className="sr-only">
          <SheetTitle className="sr-only">Data breakdown</SheetTitle>
          <SheetDescription className="sr-only">
            Data breakdown
          </SheetDescription>
        </SheetHeader>
        <SearchableList
          items={widgets.filter(
            (w) =>
              w.visualisations.some((v) => v !== "horizontal_bar_chart") &&
              EXCLUDED_WIDGET_INDICATORS.includes(w.indicator) === false,
          )}
          itemKey="title"
          onItemClick={(w) => {
            setBreakdown(w.indicator);
            setShowIndicators(false);
            setshowOverlay(false);
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default BreakdownSelector;
