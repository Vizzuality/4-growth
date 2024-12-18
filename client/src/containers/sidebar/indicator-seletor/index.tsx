import { FC, useState } from "react";

import { BaseWidgetWithData } from "@shared/dto/widgets/base-widget-data.interface";
import { BaseWidget } from "@shared/dto/widgets/base-widget.entity";
import { useSetAtom } from "jotai";

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

interface IndicatorSelectorProps {
  widget?: BaseWidgetWithData;
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
        className={SIDEBAR_POPOVER_CLASS}
      >
        <SearchableList
          items={widgets.filter((w) =>
            w.visualisations.every((v) => v !== "single_value"),
          )}
          itemKey="indicator"
          onItemClick={(w) => {
            onIndicatorSelected(w.indicator);
            setShowIndicators(false);
            setshowOverlay(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default IndicatorSelector;
