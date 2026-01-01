"use client";
import { FC, useEffect, useState } from "react";

import { WidgetVisualizationsType } from "@shared/dto/widgets/widget-visualizations.constants";

import {
  getAbsoluteValue,
  getResponseRate,
  normalizeWidgetData,
} from "@/lib/normalize-widget-data";
import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import useFilters from "@/hooks/use-filters";
import useSandboxWidget from "@/hooks/use-sandbox-widget";

import IndicatorSelector from "@/containers/bottom-bar/survey-analysis/indicator-seletor";
import VisualizationSelector from "@/containers/bottom-bar/survey-analysis/visualization-selector";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const SettingsSheet: FC = () => {
  const {
    breakdown,
    indicator,
    visualization,
    setIndicator,
    setVisualization,
  } = useSandboxWidget();
  const { filters } = useFilters();
  const [open, setOpen] = useState(false);
  const [newIndicator, setNewIndicator] = useState<string>("");
  const [newVisualization, setNewVisualization] =
    useState<WidgetVisualizationsType | null>(null);
  const { data: widget } = client.widgets.getWidget.useQuery(
    queryKeys.widgets.one(newIndicator, filters, breakdown || undefined)
      .queryKey,
    {
      params: { id: newIndicator },
      query: {
        filters,
        breakdown: breakdown || undefined,
      },
    },
    {
      enabled: !!newIndicator,
      // No retry to immediately show the final component or we have to add a spinner?
      retry: 0,
      select: (res) => ({
        ...res.body.data,
        data: {
          raw: res.body.data.data,
          percentages: normalizeWidgetData(res.body.data.data),
        },
        responseRate: getResponseRate(res.body.data.data),
        absoluteValue: getAbsoluteValue(res.body.data.data),
      }),
    },
  );
  const handleSubmitButtonClick = () => {
    setIndicator(newIndicator);
    setVisualization(newVisualization);
    handleClose();
  };
  const handleClose = () => {
    setOpen(false);
    setNewIndicator("");
    setNewVisualization(null);
  };

  useEffect(() => {
    if (open) {
      setNewIndicator(indicator);
      setNewVisualization(visualization);
    }
  }, [open, indicator, visualization, setNewIndicator, setNewVisualization]);

  useEffect(() => {
    if (!widget) return;

    if (
      !newVisualization ||
      !widget.visualisations.includes(newVisualization)
    ) {
      setNewVisualization(widget.defaultVisualization);
    }
  }, [widget, newVisualization, setNewVisualization]);

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (open) {
          setOpen(open);
        } else {
          handleClose();
        }
      }}
    >
      <SheetTrigger asChild>
        <Button className="w-full">Settings</Button>
      </SheetTrigger>
      <SheetContent
        className="flex h-full max-h-[80%] w-screen flex-col justify-between rounded-t-2xl border-t-navy-900 bg-navy-900 px-0 pb-0"
        side="bottom"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="px-4 text-left text-base">Settings</SheetTitle>
          <SheetDescription className="sr-only">Settings</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full">
          <VisualizationSelector
            indicator={newIndicator}
            visualization={newVisualization}
            widget={widget}
            onVisualizationSelected={setNewVisualization}
          />
          <IndicatorSelector
            widget={widget}
            onIndicatorSelected={setNewIndicator}
          />
        </ScrollArea>
        <Button className="w-full" onClick={handleSubmitButtonClick}>
          Apply
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSheet;
