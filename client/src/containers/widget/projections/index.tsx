"use client";

import { useEffect, useMemo, useState } from "react";

import { ProjectionVisualizationsType } from "@shared/dto/projections/projection-visualizations.constants";
import { ProjectionWidgetData } from "@shared/dto/projections/projection-widget.entity";
import { useAtom } from "jotai";

import { cn } from "@/lib/utils";

import { focusedWidgetAtom } from "@/containers/explore/store";
import NoData from "@/containers/no-data";
import { showOverlayAtom } from "@/containers/overlay/store";
import LineChart from "@/containers/widget/line-chart";
import WidgetMenu from "@/containers/widget/projections/menu";
import { widgetDescriptionMap } from "@/containers/widget/projections/utils";
import TableView from "@/containers/widget/table";
import UnitSelect from "@/containers/widget/unit-select";
import { getDefaultProjectionUnit } from "@/containers/widget/utils";
import VerticalBarChart from "@/containers/widget/vertical-bar-chart";
import WidgetHeader from "@/containers/widget/widget-header";

import { Card } from "@/components/ui/card";

export interface WidgetProps {
  indicator: string;
  visualization: ProjectionVisualizationsType;
  data?: ProjectionWidgetData;
  visualisations?: ProjectionVisualizationsType[];
  description?: string;
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
  description,
  className,
  showCustomizeWidgetButton,
  config,
}: WidgetProps) {
  const widgetDescription = widgetDescriptionMap[indicator];
  const units = useMemo(() => (data ? Object.keys(data) : []), [data]);
  const [selectedUnit, setSelectedUnit] = useState(
    getDefaultProjectionUnit(data, indicator),
  );
  const [selectedVisualization, setSelectedVisualization] =
    useState<ProjectionVisualizationsType>(visualization);
  const [showOverlay, setShowOverlay] = useAtom(showOverlayAtom);
  const [focusedWidget, setFocusedWidget] = useAtom(focusedWidgetAtom);
  const highlightWidget = showOverlay && indicator === focusedWidget;
  const menuComponent = (
    <WidgetMenu
      visualisations={visualisations}
      info={description ? { title: indicator, description } : undefined}
      selectedVisualization={selectedVisualization}
      showCustomizeWidgetButton={showCustomizeWidgetButton}
      setShowOverlay={setShowOverlay}
      setFocusedWidget={setFocusedWidget}
      setSelectedVisualization={setSelectedVisualization}
      indicator={indicator}
      className={config?.menu?.className}
    />
  );
  const selectComponent = (
    <UnitSelect
      id={indicator}
      items={units}
      value={selectedUnit}
      onValueChange={setSelectedUnit}
    />
  );

  useEffect(() => {
    setSelectedVisualization(visualization);
  }, [visualization]);

  useEffect(() => {
    setSelectedUnit(getDefaultProjectionUnit(data, indicator));
  }, [units, setSelectedUnit, data, indicator]);

  if (!data || Object.keys(data).length === 0) {
    return (
      <Card className={cn("relative min-h-80 p-0", className)}>
        <WidgetHeader
          title={indicator}
          question={widgetDescription}
          menu={menuComponent}
        />
        <NoData />
      </Card>
    );
  }

  switch (selectedVisualization) {
    case "bar_chart":
      return (
        <Card
          className={cn("relative p-0", highlightWidget && "z-50", className)}
        >
          <WidgetHeader
            title={indicator}
            question={widgetDescription}
            menu={menuComponent}
            select={selectComponent}
          />
          <VerticalBarChart
            unit={selectedUnit}
            indicator={indicator}
            data={data[selectedUnit]}
            enableHoverStyles
          />
        </Card>
      );
    case "line_chart":
      return (
        <Card
          className={cn("relative p-0", highlightWidget && "z-50", className)}
        >
          <WidgetHeader
            title={indicator}
            question={widgetDescription}
            menu={menuComponent}
            select={selectComponent}
          />
          <LineChart
            indicator={indicator}
            unit={selectedUnit}
            data={data[selectedUnit]}
            dataKey="value"
          />
        </Card>
      );
    case "table":
      return (
        <Card
          className={cn("relative p-0", highlightWidget && "z-50", className)}
        >
          <WidgetHeader
            title={indicator}
            question={widgetDescription}
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
            highlightWidget && "z-50",
            className,
          )}
        >
          <WidgetHeader
            title={indicator}
            question={widgetDescription}
            menu={menuComponent}
          />
        </Card>
      );

    default:
      console.error(
        `Widget: Unsupported visualization type "${visualization}" for indicator "${indicator}".`,
      );
      return null;
  }
}
