"use client";
import { FC } from "react";

import { useAtom, useAtomValue } from "jotai";

import { normalizeWidgetData } from "@/lib/normalize-widget-data";
import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import IndicatorSelector from "@/containers/sidebar/indicator-seletor";
import {
  sandboxFiltersAtom,
  sandboxVisualizationAtom,
  sandboxIndicatorAtom,
} from "@/containers/sidebar/store";
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
  const filters = useAtomValue(sandboxFiltersAtom);
  const [indicator, setIndicator] = useAtom(sandboxIndicatorAtom);
  const [visualization, setVisualization] = useAtom(sandboxVisualizationAtom);
  const getWidgetQuery = client.widgets.getWidget.useQuery(
    queryKeys.widgets.one(indicator || "", filters).queryKey,
    {
      params: { id: indicator as string },
      query: {
        filters: filters,
      },
    },
    {
      enabled: !!indicator,
      select: (res) => ({
        ...res.body.data,
        data: {
          raw: res.body.data.data,
          percentages: normalizeWidgetData(res.body.data.data),
        },
      }),
    },
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full">Settings</Button>
      </SheetTrigger>
      <SheetContent className="h-screen w-screen bg-navy-900" side="bottom">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="py-3.5">
          <VisualizationSelector
            indicator={indicator}
            visualization={visualization}
            widget={getWidgetQuery.data}
            onVisualizationSelected={setVisualization}
          />
          <IndicatorSelector
            widget={getWidgetQuery.data}
            onIndicatorSelected={setIndicator}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSheet;
