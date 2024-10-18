"use client";
import { useEffect } from "react";

import { useAtom } from "jotai";

import {
  customWidgetAtom,
  selectedVisualizationAtom,
} from "@/containers/sandbox/store";

import { Card } from "@/components/ui/card";
import Title from "@/components/ui/title";

export default function Sandbox() {
  const [widget, setWidget] = useAtom(customWidgetAtom);
  const [selectedVisualization, setSelectedVisualization] = useAtom(
    selectedVisualizationAtom,
  );

  useEffect(() => {
    if (!widget || !selectedVisualization) return;

    if (!widget.visualisations.includes(selectedVisualization)) {
      setWidget(null);
    }
  }, [widget, selectedVisualization]);

  useEffect(() => {
    // cleanup
    return () => {
      setWidget(null);
      setSelectedVisualization(null);
    };
  }, []);

  return (
    <Card className="p-6">
      <header className="space-y-2">
        <Title as="h2" className="text-base font-normal">
          {widget?.indicator}
        </Title>
        <p className="text-xs text-muted-foreground">{widget?.question}</p>
      </header>
    </Card>
  );
}
