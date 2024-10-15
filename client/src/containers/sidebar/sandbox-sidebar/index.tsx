import { FC, useEffect, useState } from "react";

import { BaseWidgetWithData } from "@shared/dto/widgets/base-widget-data.interface";
import {
  VALID_WIDGET_VISUALIZATIONS,
  WidgetVisualizationsType,
} from "@shared/dto/widgets/widget-visualizations.constants";
import { useAtom } from "jotai";

import {
  customWidgetAtom,
  selectedVisualizationAtom,
} from "@/containers/sandbox/store";
import SidebarAccordion from "@/containers/sidebar/sidebar-accordion";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import widgets from "../widgets.json";

interface SandboxSidebarProps {
  widgets: BaseWidgetWithData[];
}

const getVisualizationText = (value: WidgetVisualizationsType): string =>
  value
    .split("_")
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
    )
    .join(" ");

const SandboxSidebar: FC<SandboxSidebarProps> = () => {
  const [widget, setWidget] = useAtom(customWidgetAtom);
  const [selectedVisualization, setSelectedVisualization] = useAtom(
    selectedVisualizationAtom,
  );
  const [showVisualizations, setShowVisualizations] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);

  useEffect(() => {
    if (!widget || !selectedVisualization) return;

    if (!widget.visualisations.includes(selectedVisualization)) {
      setWidget(null);
    }
  }, [widget, selectedVisualization]);

  return (
    <SidebarAccordion defaultValue={["sandbox-settings", "sandbox-filters"]}>
      <AccordionItem value="sandbox-settings">
        <AccordionTrigger>Settings</AccordionTrigger>
        <AccordionContent className="py-3.5">
          <Popover
            open={showVisualizations}
            onOpenChange={setShowVisualizations}
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
            <PopoverContent align="start" side="bottom" className="ml-4 w-full">
              <div className="flex h-full flex-col overflow-y-auto">
                {VALID_WIDGET_VISUALIZATIONS.map((v) => (
                  <Button
                    key={`v-list-item-${v}`}
                    variant="clean"
                    className="h-4 cursor-pointer justify-start rounded-none px-3 py-4 text-xs font-medium transition-colors hover:bg-slate-100"
                    onClick={() => {
                      setSelectedVisualization(v);
                      setShowVisualizations(false);
                    }}
                  >
                    {getVisualizationText(v)}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Popover open={showIndicators} onOpenChange={setShowIndicators}>
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
            <PopoverContent align="start" side="bottom" className="ml-4 w-full">
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
                    }}
                  >
                    {w.indicator}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="sandbox-filters">
        <AccordionTrigger>Filters</AccordionTrigger>
        <AccordionContent className="py-3.5">filters here...</AccordionContent>
      </AccordionItem>
    </SidebarAccordion>
  );
};

export default SandboxSidebar;
