"use client";
import { FC } from "react";

import useSandboxWidget from "@/hooks/use-sandbox-widget";

import IndicatorSelector from "@/containers/sidebar/indicator-seletor";
import VisualizationSelector from "@/containers/sidebar/visualization-selector";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const SettingsSheet: FC = () => {
  const {
    indicator,
    visualization,
    getWidgetQuery: { data: widget },
    setIndicator,
    setVisualization,
  } = useSandboxWidget();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full">Settings</Button>
      </SheetTrigger>
      <SheetContent className="h-full w-screen bg-navy-900" side="bottom">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="py-3.5">
          <VisualizationSelector
            indicator={indicator}
            visualization={visualization}
            widget={widget}
            onVisualizationSelected={setVisualization}
          />
          <IndicatorSelector
            widget={widget}
            onIndicatorSelected={setIndicator}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSheet;
