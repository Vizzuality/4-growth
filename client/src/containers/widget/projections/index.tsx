"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { ProjectionVisualizationsType } from "@shared/dto/projections/projection-visualizations.constants";
import { ProjectionWidgetData } from "@shared/dto/projections/projection-widget.entity";
import { useAtom } from "jotai";

import { cn } from "@/lib/utils";

import MenuButton from "@/containers/menu-button";
import NoData from "@/containers/no-data";
import { showOverlayAtom } from "@/containers/overlay/store";
import AreaChart from "@/containers/widget/area-chart";
import LineChart from "@/containers/widget/line-chart";
import TableView from "@/containers/widget/table";
import VerticalBarChart from "@/containers/widget/vertical-bar-chart";
import WidgetHeader from "@/containers/widget/widget-header";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getRouteHref } from "@/utils/route-config";

const getMenuButtonText = (v: ProjectionVisualizationsType): string => {
  switch (v) {
    case "line_chart":
      return "Show as a line chart";
    case "area_chart":
      return "Show as an area chart";
    case "bar_chart":
      return "Show as a bar chart";
    case "bubble_chart":
      return "Show as a bubble chart";
    case "table":
      return "Show as a table";
    default:
      return "";
  }
};

export interface WidgetProps {
  indicator: string;
  visualization: ProjectionVisualizationsType;
  data?: ProjectionWidgetData[];
  visualisations?: ProjectionVisualizationsType[];
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
  visualization,
  visualisations,
  data,
  menu,
  className,
  showCustomizeWidgetButton,
  config,
}: WidgetProps) {
  const [selectedVisualization, setSelectedVisualization] =
    useState<ProjectionVisualizationsType>(visualization);
  const [showOverlay, setShowOverlay] = useAtom(showOverlayAtom);
  const widgetComponentProps = useMemo(
    () => ({ indicator, data }),
    [indicator, data],
  );
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

  if (!data || data.length === 0) {
    return (
      <Card className={cn("relative min-h-80 p-0", className)}>
        <WidgetHeader indicator={indicator} menu={menuComponent} />
        <NoData />
      </Card>
    );
  }

  switch (selectedVisualization) {
    case "bar_chart":
      return (
        <Card className={cn("relative p-0", showOverlay && "z-50", className)}>
          <WidgetHeader indicator={indicator} menu={menuComponent} />
          <VerticalBarChart {...widgetComponentProps} />
        </Card>
      );
    case "line_chart":
      return (
        <Card className={cn("relative p-0", showOverlay && "z-50", className)}>
          <WidgetHeader indicator={indicator} menu={menuComponent} />
          <LineChart {...widgetComponentProps} />
        </Card>
      );
    case "area_chart":
      return (
        <Card className={cn("relative p-0", showOverlay && "z-50", className)}>
          <WidgetHeader indicator={indicator} menu={menuComponent} />
          <AreaChart {...widgetComponentProps} />
        </Card>
      );
    case "table":
      return (
        <Card className={cn("relative p-0", showOverlay && "z-50", className)}>
          <WidgetHeader indicator={indicator} menu={menuComponent} />
          <TableView {...widgetComponentProps} />
        </Card>
      );
    case "bubble_chart":
      return (
        <Card
          className={cn(
            "relative min-h-80 p-0 pb-7",
            showOverlay && "z-50",
            className,
          )}
        >
          <WidgetHeader indicator={indicator} menu={menuComponent} />
        </Card>
      );

    default:
      console.error(
        `Widget: Unsupported visualization type "${visualization}" for indicator "${indicator}".`,
      );
      return null;
  }
}
