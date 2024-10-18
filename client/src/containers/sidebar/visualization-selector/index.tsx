import { FC, useState } from "react";

import {
  WidgetVisualizationsType,
  VALID_WIDGET_VISUALIZATIONS,
} from "@shared/dto/widgets/widget-visualizations.constants";
import { useAtom, useSetAtom } from "jotai";

import { selectedVisualizationAtom } from "@/containers/sandbox/store";
import { isPopoverOpenAtom } from "@/containers/sidebar/store";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { POPOVER_CONTENT_CLASS } from "@/constants";

const getVisualizationText = (value: WidgetVisualizationsType): string =>
  value
    .split("_")
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
    )
    .join(" ");

const VisualizationSelector: FC = () => {
  const [showVisualizations, setShowVisualizations] = useState(false);
  const setIsPopoverOpen = useSetAtom(isPopoverOpenAtom);
  const [selectedVisualization, setSelectedVisualization] = useAtom(
    selectedVisualizationAtom,
  );

  return (
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
  );
};

export default VisualizationSelector;
