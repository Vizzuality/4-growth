"use client";
import { useEffect } from "react";

import useWidgets from "@/hooks/use-widgets";

import Widget from "@/containers/widget";
import CreateWidgetMenu from "@/containers/widget/create-widget";

import { Card } from "@/components/ui/card";

export default function Sandbox() {
  const { visualization, setVisualization, widget } = useWidgets();

  useEffect(() => {
    if (!widget) return;

    if (!visualization || !widget.visualisations.includes(visualization)) {
      setVisualization(widget.defaultVisualization);
    }
  }, [widget, visualization]);

  return (
    <Card className="p-0">
      {widget && (
        <Widget
          breakdown={breakdown || undefined}
          indicator={widget.indicator}
          question={widget.question}
          visualization={visualization || widget.defaultVisualization}
          data={widget.data}
          menu={<CreateWidgetMenu />}
          className="col-span-1 last:odd:col-span-2"
          config={{ menu: { className: "flex flex-col py-4" } }}
        />
      )}
    </Card>
  );
}
