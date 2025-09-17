"use client";

import { useMemo } from "react";

import {
  BubbleProjection,
  CustomProjection,
} from "@shared/dto/projections/custom-projection.type";
import { ProjectionVisualizationsType } from "@shared/dto/projections/projection-visualizations.constants";

import { cn } from "@/lib/utils";

import NoData from "@/containers/no-data";
import BubbleChart from "@/containers/widget/bubble-chart";
import WidgetLegend from "@/containers/widget/legend";
import LineChart from "@/containers/widget/line-chart";
import { getSimpleChartProps } from "@/containers/widget/utils";
import VerticalBarChart from "@/containers/widget/vertical-bar-chart";
import WidgetHeader from "@/containers/widget/widget-header";

import { Card } from "@/components/ui/card";

export interface SandboxWidgetProps {
  indicator: string;
  visualization: ProjectionVisualizationsType;
  data: CustomProjection;
  className?: string;
}

export default function SandboxWidget({
  indicator,
  visualization,
  data,
  className,
}: SandboxWidgetProps) {
  const simpleChartProps = useMemo(
    () => ({
      indicator,
      ...getSimpleChartProps(data),
    }),
    [indicator, data],
  );
  if (!data || data.length === 0) {
    return (
      <Card className={cn("relative min-h-80 p-0", className)}>
        <NoData />
      </Card>
    );
  }

  switch (visualization) {
    case "bar_chart":
      return (
        <Card className={cn("relative p-0", className)}>
          <WidgetHeader indicator={indicator} className="pb-0" />
          <WidgetLegend colors={simpleChartProps.colors} className="m-6" />
          <VerticalBarChart {...simpleChartProps} />
        </Card>
      );
    case "line_chart":
      return (
        <Card className={cn("relative p-0", className)}>
          <WidgetHeader indicator={indicator} className="pb-0" />
          <WidgetLegend colors={simpleChartProps.colors} className="m-6" />
          <LineChart
            dataKey={simpleChartProps.indicator}
            {...simpleChartProps}
          />
        </Card>
      );
    case "bubble_chart":
      if ("bubble" in data[0]) {
        return (
          <Card className={cn("relative min-h-80 p-6", className)}>
            <BubbleChart data={data as BubbleProjection[]} />
          </Card>
        );
      }
      return null;
    default:
      console.error(
        `Widget: Unsupported visualization type "${visualization}" for indicator "${indicator}".`,
      );
      return null;
  }
}
