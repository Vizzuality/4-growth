import { FC, useState } from "react";

import { BaseWidget } from "@shared/dto/widgets/base-widget.entity";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

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
import { TransformedWidget } from "@/types";

interface IndicatorSelectorProps {
  widget?: TransformedWidget;
  onIndicatorSelected: (indicator: string) => void;
}
const IndicatorSelector: FC<IndicatorSelectorProps> = ({
  widget,
  onIndicatorSelected,
}) => {
  const { data } = client.widgets.getWidgets.useQuery(
    queryKeys.widgets.all.queryKey,
    { query: {} },
    { select: (res) => res.body.data },
  );
  const [showIndicators, setShowIndicators] = useState(false);
  const widgets = data as BaseWidget[];

  return (
    <Sheet open={showIndicators} onOpenChange={setShowIndicators}>
      <SheetTrigger>
        <Button
          variant="clean"
          className="inline-block h-full w-full whitespace-pre-wrap rounded-none px-4 py-3.5 text-left font-normal transition-colors hover:bg-secondary"
        >
          <span>Indicator</span>
          {widget && (
            <>
              <span>&nbsp;is&nbsp;</span>
              <span className="font-bold">{`${widget.title}`}</span>
            </>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex h-full max-h-[70%] w-screen flex-col justify-between overflow-hidden rounded-t-2xl bg-slate-100 p-0 text-background"
        side="bottom"
        hideCloseButton
      >
        <SheetHeader className="sr-only">
          <SheetTitle className="sr-only">Filters</SheetTitle>
          <SheetDescription className="sr-only">Filters</SheetDescription>
        </SheetHeader>
        <SearchableList
          items={
            widgets?.filter((w) =>
              w.visualisations.every((v) => v !== "single_value"),
            ) || []
          }
          itemKey="title"
          onItemClick={(w) => {
            onIndicatorSelected(w.indicator);
            setShowIndicators(false);
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default IndicatorSelector;
