"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  WIDGET_VISUALIZATIONS,
  WidgetVisualizationsType,
} from "@shared/dto/widgets/widget-visualizations.constants";
import { useAtom } from "jotai";

import { removeNaLabels } from "@/lib/normalize-widget-data";
import { cn, isEmptyWidget } from "@/lib/utils";

import MenuButton from "@/containers/menu-button";
import NoData from "@/containers/no-data";
import { showOverlayAtom } from "@/containers/overlay/store";
import AreaChart from "@/containers/widget/area-chart";
import Breakdown from "@/containers/widget/breakdown";
import Filter from "@/containers/widget/filter";
import HorizontalBarChart from "@/containers/widget/horizontal-bar-chart";
import Map from "@/containers/widget/map";
import Navigation from "@/containers/widget/navigation";
import PieChart from "@/containers/widget/pie-chart";
import SingleValue from "@/containers/widget/single-value";
import WidgetHeader from "@/containers/widget/widget-header";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TransformedWidgetData } from "@/types";
import { getRouteHref } from "@/utils/route-config";

const getMenuButtonText = (v: WidgetVisualizationsType): string => {
  switch (v) {
    case "horizontal_bar_chart":
      return "Show as a bar chart";
    case "pie_chart":
      return "Show as a pie chart";
    case "area_graph":
      return "Show as an area chart";
    case "map":
      return "Show as a map";
    default:
      return "";
  }
};

export interface WidgetProps {
  indicator: string;
  data: TransformedWidgetData;
  visualization: WidgetVisualizationsType;
  responseRate: number;
  breakdown?: string;
  visualisations?: WidgetVisualizationsType[];
  question?: string;
  menu?: React.ReactNode;
  className?: string;
  showCustomizeWidgetButton?: boolean;
  config?: {
    singleValue?: { fill?: "bg-secondary" | "bg-accent" };
    horizontalBarChart?: { barSize: number };
    pieChart?: {
      className: HTMLDivElement["className"];
      legendPosition?: "bottom" | "right";
    };
    menu?: { className: string };
  };
}

export default function Widget({
  indicator,
  responseRate,
  visualization,
  visualisations,
  breakdown,
  data,
  question,
  menu,
  className,
  showCustomizeWidgetButton,
  config,
}: WidgetProps) {
  const [selectedVisualization, setSelectedVisualization] =
    useState(visualization);
  const [showOverlay, setShowOverlay] = useAtom(showOverlayAtom);
  const menuComponent =
    menu ||
    (!visualisations && !showCustomizeWidgetButton ? undefined : (
      <MenuButton
        className={className}
        onOpenChange={setShowOverlay}
        {...config?.menu}
      >
        {showCustomizeWidgetButton && (
          <Button
            variant="clean"
            className="block rounded-none px-6 py-2 text-left transition-colors hover:bg-muted"
            asChild
          >
            <Link
              href={
                getRouteHref("surveyAnalysis", "sandbox") +
                `?visualization=${selectedVisualization}&indicator=${indicator}`
              }
            >
              Customize chart
            </Link>
          </Button>
        )}
        {visualisations && (
          <>
            <Separator />
            {visualisations.map((v) => (
              <Button
                key={`visualization-list-item-${v}`}
                variant="clean"
                className="block rounded-none px-6 py-2 text-left transition-colors hover:bg-muted"
                onClick={() => setSelectedVisualization(v)}
              >
                {getMenuButtonText(v)}
              </Button>
            ))}
          </>
        )}
      </MenuButton>
    ));

  useEffect(() => {
    setSelectedVisualization(visualization);
  }, [visualization]);

  if (isEmptyWidget(data.raw)) {
    return (
      <Card className={cn("relative min-h-80 p-0", className)}>
        <WidgetHeader
          indicator={indicator}
          question={question}
          menu={menuComponent}
          responseRate={responseRate}
        />
        <NoData />
      </Card>
    );
  }

  if (breakdown) {
    return (
      <Card
        className={cn(
          "relative min-h-80 p-0 pb-7",
          showOverlay && "z-50",
          className,
        )}
      >
        <WidgetHeader indicator={indicator} question={question} menu={menu} />
        <Breakdown data={data.percentages.breakdown} />
      </Card>
    );
  }

  switch (selectedVisualization) {
    case WIDGET_VISUALIZATIONS.SINGLE_VALUE:
      return (
        <Card className="p-0">
          <SingleValue
            indicator={indicator}
            data={data?.percentages.counter}
            {...config?.singleValue}
          />
        </Card>
      );
    case WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART:
      return (
        <Card
          className={cn(
            "relative min-h-80 p-0 pb-7",
            showOverlay && "z-50",
            className,
          )}
        >
          <WidgetHeader
            indicator={indicator}
            question={question}
            menu={menuComponent}
            responseRate={responseRate}
          />
          <HorizontalBarChart
            data={removeNaLabels(data.raw.chart)}
            {...config?.horizontalBarChart}
          />
        </Card>
      );
    case WIDGET_VISUALIZATIONS.PIE_CHART:
      return (
        <Card
          className={cn(
            "relative min-h-80 p-0 pb-7",
            showOverlay && "z-50",
            className,
          )}
        >
          <WidgetHeader
            indicator={indicator}
            question={question}
            menu={menuComponent}
            responseRate={responseRate}
          />
          <PieChart
            data={data.percentages.chart}
            className="min-h-0 w-full flex-1"
            legendPosition="bottom"
            {...config?.pieChart}
          />
        </Card>
      );
    case WIDGET_VISUALIZATIONS.AREA_GRAPH:
      return (
        <Card
          className={cn(
            "relative min-h-80 p-0",
            showOverlay && "z-50",
            className,
          )}
        >
          <WidgetHeader
            indicator={indicator}
            question={question}
            className="t-8 absolute left-0 z-20 w-full p-8"
            menu={menuComponent}
            responseRate={responseRate}
          />
          <AreaChart indicator={indicator} data={data.percentages.chart} />
        </Card>
      );
    case WIDGET_VISUALIZATIONS.NAVIGATION:
      return (
        <Card
          className={cn(
            "relative min-h-80 p-0",
            showOverlay && "z-50",
            className,
          )}
        >
          <Navigation indicator={indicator} href={data?.raw.navigation?.href} />
        </Card>
      );
    case WIDGET_VISUALIZATIONS.FILTER:
      return (
        <Card
          className={cn(
            "relative min-h-80 bg-accent p-0",
            showOverlay && "z-50",
            className,
          )}
        >
          <Filter indicator={indicator} href={data?.raw.navigation?.href} />
        </Card>
      );
    case WIDGET_VISUALIZATIONS.MAP:
      return (
        <Card className={cn("relative p-0", showOverlay && "z-50", className)}>
          <WidgetHeader
            indicator={indicator}
            question={question}
            className="t-8 absolute left-0 z-20 w-full p-8"
            menu={menuComponent}
            responseRate={responseRate}
          />
          <Map data={data.percentages.map} />
        </Card>
      );
    default:
      console.error(
        `Widget: Unsupported visualization type "${visualization}" for indicator "${indicator}".`,
      );
      return null;
  }
}
