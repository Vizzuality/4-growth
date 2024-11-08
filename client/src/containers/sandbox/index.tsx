"use client";
import { FC, useEffect } from "react";

import useFilters from "@/hooks/use-filters";
import useSandboxWidget from "@/hooks/use-sandbox-widget";

import Widget from "@/containers/widget";
import CreateWidgetMenu from "@/containers/widget/create-widget";

import { Card } from "@/components/ui/card";

const Sandbox: FC = () => {
  const { indicator, visualization, setVisualization, widget } =
    useSandboxWidget();
  const { filters } = useFilters();

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
          menu={
            <CreateWidgetMenu
              indicator={indicator}
              visualization={visualization}
              filters={filters}
            />
          }
          className="col-span-1 last:odd:col-span-2"
          config={{ menu: { className: "flex flex-col py-4" } }}
        />
      )}
    </Card>
  );
};

export default Sandbox;
