import { FC, useState } from "react";

import {
  WidgetVisualizationsType,
  VALID_WIDGET_VISUALIZATIONS,
} from "@shared/dto/widgets/widget-visualizations.constants";
import { useSetAtom } from "jotai";

import useSandboxWidget from "@/hooks/use-sandbox-widget";

import { showOverlayAtom } from "@/containers/overlay/store";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SIDEBAR_POPOVER_CLASS } from "@/constants";

const getVisualizationText = (value: WidgetVisualizationsType): string =>
  value
    .split("_")
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
    )
    .join(" ");

const VisualizationSelector: FC = () => {
  const [showVisualizations, setShowVisualizations] = useState(false);
  const setShowOverlay = useSetAtom(showOverlayAtom);
  const { visualization, setVisualization } = useSandboxWidget();

  return (
    <Popover
      open={showVisualizations}
      onOpenChange={(o) => {
        setShowVisualizations(o);
        setShowOverlay(o);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="clean"
          className="inline-block h-full w-full whitespace-pre-wrap rounded-none px-4 py-3.5 text-left font-normal transition-colors hover:bg-secondary"
        >
          <span>Type</span>
          {visualization && (
            <>
              <span>&nbsp;is&nbsp;</span>
              <span className="font-bold">
                {getVisualizationText(visualization)}
              </span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className={SIDEBAR_POPOVER_CLASS}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {VALID_WIDGET_VISUALIZATIONS.map((v) => (
            <Button
              key={`v-list-item-${v}`}
              variant="clean"
              className="h-10 cursor-pointer justify-start rounded-none px-3 py-4 text-xs font-medium transition-colors hover:bg-slate-100"
              onClick={() => {
                setVisualization(v);
                setShowVisualizations(false);
                setShowOverlay(false);
              }}
            >
              {getVisualizationText(v)}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VisualizationSelector;
