import { FC, Fragment, useState } from "react";

import { BaseWidgetWithData } from "@shared/dto/widgets/base-widget-data.interface";
import {
  WidgetVisualizationsType,
  VALID_WIDGET_VISUALIZATIONS,
} from "@shared/dto/widgets/widget-visualizations.constants";
import { useSetAtom } from "jotai";

import { showOverlayAtom } from "@/containers/overlay/store";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "@/components/ui/tooltip";
import { SIDEBAR_POPOVER_CLASS } from "@/constants";

const getVisualizationText = (value: WidgetVisualizationsType): string =>
  value
    .split("_")
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
    )
    .join(" ");

interface VisualizationSelectorProps {
  indicator: string | null;
  visualization: WidgetVisualizationsType | null;
  widget: BaseWidgetWithData | undefined;
  onVisualizationSelected: (value: WidgetVisualizationsType | null) => void;
}
const VisualizationSelector: FC<VisualizationSelectorProps> = ({
  indicator,
  visualization,
  widget,
  onVisualizationSelected,
}) => {
  const [showVisualizations, setShowVisualizations] = useState(false);
  const setShowOverlay = useSetAtom(showOverlayAtom);

  if (!indicator) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger className="inline-block h-full w-full whitespace-pre-wrap rounded-none px-4 py-3.5 text-left font-normal text-slate-400">
            Type
          </TooltipTrigger>
          <TooltipContent
            align="start"
            alignOffset={16}
            sideOffset={-8}
            className="rounded-lg border-none px-2 py-1 text-2xs"
          >
            <p>Select an indicator first.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

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
        onOpenAutoFocus={(event) => {
          // This prevents the tooltip to automatically trigger
          event.preventDefault();
        }}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {VALID_WIDGET_VISUALIZATIONS.filter(
            (v) => v !== "filter" && v !== "navigation" && v !== "single_value",
          ).map((v) => (
            <Fragment key={`v-list-item-${v}`}>
              {!widget?.visualisations.includes(v) ? (
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button
                        className="h-10 cursor-pointer justify-start rounded-none px-3 py-4 text-xs font-medium text-slate-400"
                        variant="clean"
                      >
                        {getVisualizationText(v)}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      align="start"
                      alignOffset={16}
                      sideOffset={-8}
                      className="rounded-lg border-none bg-popover-foreground px-2 py-1 text-2xs text-white"
                    >
                      <p>Not available for the current indicator.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button
                  variant="clean"
                  className="h-10 cursor-pointer justify-start rounded-none px-3 py-4 text-xs font-medium transition-colors hover:bg-slate-100"
                  onClick={() => {
                    onVisualizationSelected(v);
                    setShowVisualizations(false);
                    setShowOverlay(false);
                  }}
                >
                  {getVisualizationText(v)}
                </Button>
              )}
            </Fragment>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VisualizationSelector;
