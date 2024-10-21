import { FC, useState } from "react";

import { BaseWidgetWithData } from "@shared/dto/widgets/base-widget-data.interface";
import { BaseWidget } from "@shared/dto/widgets/base-widget.entity";
import { useAtom, useSetAtom } from "jotai";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";

import {
  customWidgetAtom,
  selectedVisualizationAtom,
} from "@/containers/sandbox/store";
import SearchableList from "@/containers/searchable-list";
import { isPopoverOpenAtom } from "@/containers/sidebar/store";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { POPOVER_CONTENT_CLASS } from "@/constants";

const IndicatorSelector: FC = () => {
  const { data } = client.widgets.getWidgets.useQuery(
    queryKeys.widgets.all.queryKey,
    { query: { visualisations: [] } },
    { select: (res) => res.body.data },
  );
  const [showIndicators, setShowIndicators] = useState(false);
  const setIsPopoverOpen = useSetAtom(isPopoverOpenAtom);
  const [widget, setWidget] = useAtom(customWidgetAtom);
  const [selectedVisualization, setSelectedVisualization] = useAtom(
    selectedVisualizationAtom,
  );
  const widgets = data as BaseWidget[];

  return (
    <Popover
      open={showIndicators}
      onOpenChange={(o) => {
        setShowIndicators(o);
        setIsPopoverOpen(o);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="clean"
          className="inline-block h-full w-full whitespace-pre-wrap rounded-none px-4 py-3.5 text-left font-normal transition-colors hover:bg-secondary"
        >
          <span>Indicator</span>
          {widget && (
            <>
              <span>&nbsp;is&nbsp;</span>
              <span className="font-bold">{`${widget.indicator}`}</span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className={cn(POPOVER_CONTENT_CLASS, "h-[320px]")}
      >
        <SearchableList
          items={widgets}
          itemKey="indicator"
          onItemClick={(w) => {
            if (
              selectedVisualization &&
              !widget?.visualisations.includes(selectedVisualization)
            ) {
              setSelectedVisualization(null);
            }

            setWidget(w as BaseWidgetWithData);
            setShowIndicators(false);
            setIsPopoverOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default IndicatorSelector;
