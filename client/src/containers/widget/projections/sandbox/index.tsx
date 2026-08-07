"use client";

import { useEffect, useMemo, useState } from "react";

import {
  BubbleProjection,
  CustomProjection,
  SimpleProjection,
} from "@shared/dto/projections/custom-projection.type";
import { ProjectionVisualizationsType } from "@shared/dto/projections/projection-visualizations.constants";

import { cn } from "@/lib/utils";

import NoData from "@/containers/no-data";
import BubbleChart from "@/containers/widget/bubble-chart";
import WidgetLegend from "@/containers/widget/legend";
import LineChart from "@/containers/widget/line-chart";
import UnitSelect from "@/containers/widget/unit-select";
import {
  getDefaultProjectionUnit,
  getSimpleChartProps,
} from "@/containers/widget/utils";
import VerticalBarChart from "@/containers/widget/vertical-bar-chart";
import WidgetHeader from "@/containers/widget/widget-header";

import { Card } from "@/components/ui/card";
import TableView from "@/containers/widget/table";

export interface SandboxWidgetProps {
  indicator: string;
  visualization: ProjectionVisualizationsType;
  data: CustomProjection;
  className?: string;
  menu?: React.ReactNode;
}

export default function SandboxWidget({
  indicator,
  visualization,
  data,
  className,
  menu,
}: SandboxWidgetProps) {
  const units = useMemo(() => (data ? Object.keys(data) : []), [data]);
  const [selectedUnit, setSelectedUnit] = useState(
    getDefaultProjectionUnit(data, indicator),
  );
  const simpleChartProps = useMemo(
    () => ({
      indicator,
      ...getSimpleChartProps(data as SimpleProjection, selectedUnit),
    }),
    [indicator, selectedUnit, data],
  );
  const selectComponent = (
    <UnitSelect
      id={indicator}
      items={units}
      value={selectedUnit}
      onValueChange={setSelectedUnit}
      className="p-0"
    />
  );

  useEffect(() => {
    setSelectedUnit(getDefaultProjectionUnit(data, indicator));
  }, [indicator, units, setSelectedUnit, data]);

  if (!data || Object.keys(data).length === 0) {
    return (
      <Card className={cn("relative min-h-80 p-0", className)}>
        <NoData />
      </Card>
    );
  }

  if (!data[selectedUnit]) return null;

  switch (visualization) {
    case "bar_chart":
      return (
        <Card className={cn("relative p-0", className)}>
          <WidgetHeader
            title={indicator}
            className="pb-0"
            select={selectComponent}
            menu={menu}
          />
          <WidgetLegend colors={simpleChartProps.colors} className="m-6" />
          <VerticalBarChart unit={selectedUnit} {...simpleChartProps} />
        </Card>
      );
    case "line_chart":
      return (
        <Card className={cn("relative p-0", className)}>
          <WidgetHeader
            title={indicator}
            className="pb-0"
            select={selectComponent}
            menu={menu}
          />
          <WidgetLegend colors={simpleChartProps.colors} className="m-6" />
          <LineChart
            unit={selectedUnit}
            dataKey={simpleChartProps.indicator}
            {...simpleChartProps}
          />
        </Card>
      );
    case "bubble_chart":
      if ("bubble" in data[selectedUnit][0]) {
        return (
          <Card className={cn("relative min-h-80 p-6", className)}>
            <WidgetHeader
              title={indicator}
              className="p-0"
              select={selectComponent}
              menu={menu}
            />
            <BubbleChart data={data as BubbleProjection} unit={selectedUnit} />
          </Card>
        );
      }
      return null;
    case "table":
      return (
        <Card className={cn("relative p-0", className)}>
          <WidgetHeader
            title={indicator}
            className="pb-0"
            select={selectComponent}
            menu={menu}
          />
          <TableView
            indicator={indicator}
            data={data[selectedUnit] as Record<string, number>[]}
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
