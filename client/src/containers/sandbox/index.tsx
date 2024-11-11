"use client";
import { useEffect } from "react";

import useSandboxWidget from "@/hooks/use-sandbox-widget";

import Widget from "@/containers/widget";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Sandbox() {
  const { breakdown, visualization, setVisualization, widget } =
    useSandboxWidget();
  const menuItems = (
    <>
      <Button
        variant="clean"
        className="block rounded-none px-6 py-2 text-left transition-colors hover:bg-muted"
      >
        Save
      </Button>
      <Button
        variant="clean"
        className="block rounded-none px-6 py-2 text-left transition-colors hover:bg-muted"
      >
        Save as
      </Button>
    </>
  );

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
          menuItems={menuItems}
          className="col-span-1 last:odd:col-span-2"
          config={{ menu: { className: "flex flex-col py-4" } }}
        />
      )}
    </Card>
  );
}
