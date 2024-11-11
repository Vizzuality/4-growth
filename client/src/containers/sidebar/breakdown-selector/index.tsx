import { FC, useState } from "react";

import { BaseWidget } from "@shared/dto/widgets/base-widget.entity";
import { useSetAtom } from "jotai";
import { useQueryState } from "nuqs";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import { showOverlayAtom } from "@/containers/overlay/store";
import SearchableList from "@/containers/searchable-list";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SIDEBAR_POPOVER_CLASS } from "@/constants";

const BreakdownSelector: FC = () => {
  const [breakdown, setBreakdown] = useQueryState("breakdown");
  const { data } = client.widgets.getWidgets.useQuery(
    queryKeys.widgets.all.queryKey,
    { query: {} },
    { select: (res) => res.body.data },
  );
  const [showIndicators, setShowIndicators] = useState(false);
  const setshowOverlay = useSetAtom(showOverlayAtom);
  const widgets = data as BaseWidget[];

  return (
    <Popover
      open={showIndicators}
      onOpenChange={(o) => {
        setShowIndicators(o);
        setshowOverlay(o);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="clean"
          className="inline-block h-full w-full whitespace-pre-wrap rounded-none px-4 py-3.5 text-left font-normal transition-colors hover:bg-secondary"
        >
          {breakdown ? (
            <>
              <span>Breakdown by&nbsp;</span>
              <span className="font-bold">{`${breakdown}`}&nbsp;</span>
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
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className={SIDEBAR_POPOVER_CLASS}
      >
        <SearchableList
          items={widgets.filter((w) =>
            w.visualisations.some((v) => v !== "horizontal_bar_chart"),
          )}
          itemKey="indicator"
          onItemClick={(w) => {
            setBreakdown(w.indicator);
            setShowIndicators(false);
            setshowOverlay(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default BreakdownSelector;
