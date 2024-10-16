"use client";
import { Card } from "@/components/ui/card";
import Title from "@/components/ui/title";
import { customWidgetAtom } from "@/containers/sandbox/store";
import { useAtomValue } from "jotai";

export default function Sandbox() {
  const widget = useAtomValue(customWidgetAtom);
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
