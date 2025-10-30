import { FC, Fragment, useState } from "react";

import {
  WidgetVisualizationsType,
  VALID_WIDGET_VISUALIZATIONS,
} from "@shared/dto/widgets/widget-visualizations.constants";
import { useSetAtom } from "jotai";

import { showOverlayAtom } from "@/containers/overlay/store";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetDescription,
  SheetTitle,
  SheetContent,
  SheetTrigger,
  SheetHeader,
} from "@/components/ui/sheet";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "@/components/ui/tooltip";
import { TransformedWidget } from "@/types";

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
  widget: TransformedWidget | undefined;
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
      <p className="inline-block h-full w-full whitespace-pre-wrap rounded-none px-4 py-3.5 text-left font-normal text-slate-400">
        Type
      </p>
    );
  }

  return (
    <Sheet open={showVisualizations} onOpenChange={setShowVisualizations}>
      <SheetTrigger asChild>
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
      </SheetContent>
    </Sheet>
  );
};

export default VisualizationSelector;
