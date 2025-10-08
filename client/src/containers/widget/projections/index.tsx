"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { ProjectionVisualizationsType } from "@shared/dto/projections/projection-visualizations.constants";
import { ProjectionWidgetData } from "@shared/dto/projections/projection-widget.entity";
import { useAtom } from "jotai";

import { cn } from "@/lib/utils";

import MenuButton from "@/containers/menu-button";
import NoData from "@/containers/no-data";
import { showOverlayAtom } from "@/containers/overlay/store";
import LineChart from "@/containers/widget/line-chart";
import TableView from "@/containers/widget/table";
import VerticalBarChart from "@/containers/widget/vertical-bar-chart";
import WidgetHeader from "@/containers/widget/widget-header";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getRouteHref } from "@/utils/route-config";

const getMenuButtonText = (v: ProjectionVisualizationsType): string => {
  switch (v) {
    case "line_chart":
      return "Show as a line chart";
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
  data?: ProjectionWidgetData;
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
  const units = data ? Object.keys(data) : [];
  const [selectedUnit, setSelectedUnit] = useState(units[0]);
  const [selectedVisualization, setSelectedVisualization] =
    useState<ProjectionVisualizationsType>(visualization);
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
                className="block w-full rounded-none px-6 py-2 text-left transition-colors hover:bg-muted"
                onClick={() => setSelectedVisualization(v)}
              >
                {getMenuButtonText(v)}
              </Button>
            ))}
          </>
        )}
      </MenuButton>
    ));
  const selectComponent = (
    <Select
      value={selectedUnit}
      onValueChange={setSelectedUnit}
      disabled={units.length <= 1}
    >
      <SelectTrigger
        className="min-w-fit flex-1 border-transparent bg-transparent disabled:cursor-default"
        disabled={units.length <= 1}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Unit</SelectLabel>
          {units.map((unit) => (
            <SelectItem key={`select-${indicator}-${unit}`} value={unit}>
              {unit}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );

  useEffect(() => {
    setSelectedVisualization(visualization);
  }, [visualization]);

  if (!data || Object.keys(data).length === 0) {
    return (
      <Card className={cn("relative min-h-80 p-0", className)}>
        <WidgetHeader title={indicator} menu={menuComponent} />
        <NoData />
      </Card>
    );
  }

  switch (selectedVisualization) {
    case "bar_chart":
      return (
        <Card className={cn("relative p-0", showOverlay && "z-50", className)}>
          <WidgetHeader
            title={indicator}
            menu={menuComponent}
            select={selectComponent}
          />
          <VerticalBarChart indicator={indicator} data={data[selectedUnit]} />
        </Card>
      );
    case "line_chart":
      return (
        <Card className={cn("relative p-0", showOverlay && "z-50", className)}>
          <WidgetHeader
            title={indicator}
            menu={menuComponent}
            select={selectComponent}
          />
          <LineChart
            indicator={indicator}
            data={data[selectedUnit]}
            dataKey="value"
          />
        </Card>
      );
    case "table":
      return (
        <Card className={cn("relative p-0", showOverlay && "z-50", className)}>
          <WidgetHeader
            title={indicator}
            menu={menuComponent}
            select={selectComponent}
          />
          <TableView indicator={indicator} data={data[selectedUnit]} />
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
          <WidgetHeader title={indicator} menu={menuComponent} />
        </Card>
      );

    default:
      console.error(
        `Widget: Unsupported visualization type "${visualization}" for indicator "${indicator}".`,
      );
      return null;
  }
}
