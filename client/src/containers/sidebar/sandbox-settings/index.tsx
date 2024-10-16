import { FC, useEffect, useState } from "react";

import {
  VALID_WIDGET_VISUALIZATIONS,
  WidgetVisualizationsType,
} from "@shared/dto/widgets/widget-visualizations.constants";
import { useAtom, useSetAtom } from "jotai";

import {
  customWidgetAtom,
  selectedVisualizationAtom,
} from "@/containers/sandbox/store";
import { isPopoverOpenAtom } from "@/containers/sidebar/store";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import widgets from "../widgets.json";

const POPOVER_CONTENT_CLASS = "ml-4 h-[320px] w-full min-w-[320px]";
const getVisualizationText = (value: WidgetVisualizationsType): string =>
  value
    .split("_")
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
    )
    .join(" ");

const SandboxSettings: FC = () => {
  const [showVisualizations, setShowVisualizations] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);
  const [widget, setWidget] = useAtom(customWidgetAtom);
  const [selectedVisualization, setSelectedVisualization] = useAtom(
    selectedVisualizationAtom,
  );
  const setIsPopoverOpen = useSetAtom(isPopoverOpenAtom);

  useEffect(() => {
    if (!widget || !selectedVisualization) return;

    if (!widget.visualisations.includes(selectedVisualization)) {
      setWidget(null);
    }
  }, [widget, selectedVisualization]);

  useEffect(() => {
    return () => {
      setWidget(null);
      setSelectedVisualization(null);
    };
  }, []);

  return (
    <>
      <Popover
        open={showVisualizations}
        onOpenChange={(o) => {
          setShowVisualizations(o);
          setIsPopoverOpen(o);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="clean"
            className="inline-block h-full w-full whitespace-pre-wrap rounded-none px-4 py-3.5 text-left font-normal transition-colors hover:bg-secondary"
          >
            <span>Type</span>
            {selectedVisualization && (
              <>
                <span>&nbsp;is&nbsp;</span>
                <span className="font-bold">
                  {getVisualizationText(selectedVisualization)}
                </span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          className={POPOVER_CONTENT_CLASS}
        >
          <div className="flex h-full flex-col overflow-y-auto">
            {VALID_WIDGET_VISUALIZATIONS.map((v) => (
              <Button
                key={`v-list-item-${v}`}
                variant="clean"
                className="h-4 cursor-pointer justify-start rounded-none px-3 py-4 text-xs font-medium transition-colors hover:bg-slate-100"
                onClick={() => {
                  setSelectedVisualization(v);
                  setShowVisualizations(false);
                  setIsPopoverOpen(false);
                }}
              >
                {getVisualizationText(v)}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
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
          className={POPOVER_CONTENT_CLASS}
        >
          <div className="flex h-full flex-col overflow-y-auto">
            {widgets.map((w) => (
              <Button
                key={`w-list-item-${w.indicator}`}
                variant="clean"
                className="h-4 cursor-pointer justify-start rounded-none px-3 py-4 text-xs font-medium transition-colors hover:bg-slate-100"
                onClick={() => {
                  if (
                    selectedVisualization &&
                    !widget?.visualisations.includes(selectedVisualization)
                  ) {
                    setSelectedVisualization(null);
                  }
                  setWidget(w as any);
                  setShowIndicators(false);
                  setIsPopoverOpen(false);
                }}
              >
                {w.indicator}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default SandboxSettings;
