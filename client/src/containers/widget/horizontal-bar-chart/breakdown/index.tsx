"use client";
import React, { FC } from "react";

import { WidgetChartData } from "@shared/dto/widgets/base-widget-data.interface";

import { CSS_CHART_COLORS, TW_CHART_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import BaseHorizontalBarChart, {
  hasChartData,
} from "@/containers/widget/horizontal-bar-chart";

import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface SmallHorizontalBarChartProps {
  data?: { label: string; data: WidgetChartData }[];
}

const HorizontalBarChart: FC<SmallHorizontalBarChartProps> = ({ data }) => {
  if (!hasChartData(data, HorizontalBarChart.displayName)) {
    return null;
  }

  const tooltipContent = (
    <ChartTooltip
      content={
        <ChartTooltipContent
          className="rounded-2xl border-none px-4 py-2 [&>*:nth-child(2)]:hidden"
          formatter={() => null}
          labelFormatter={(label, payload) => (
            <p>
              <span className="pr-[10px] text-[10px] font-black leading-3">
                {payload[0].value}%
              </span>
              <span className="text-xs">{label}</span>
            </p>
          )}
        />
      }
    />
  );

  return (
    <div className="breakdown-chart space-y-10">
      {data.map((d) => {
        const height = d.data.length * 10;

        return (
          <div key={`breakdown-chart-${d.label}`}>
            <p className="mb-1 pl-6 text-xs">{d.label}</p>
            <BaseHorizontalBarChart
              data={d.data}
              height={height}
              barSize={7}
              barRadius={[0, 5, 5, 0]}
              getCellColor={(index) => CSS_CHART_COLORS[index]}
              containerStyle={{ maxHeight: `${height}px`, width: "60%" }}
              renderTooltip={tooltipContent}
            />
          </div>
        );
      })}
      <div
        data-testid="breakdown-chart-legend"
        className="flex items-center gap-6 pl-6"
      >
        {data[0].data.map((d, i) => (
          <p
            key={`breakdown-chart-legend-${d.label}`}
            className="flex items-center gap-x-1 text-xs"
          >
            <span
              className={cn("block h-3 w-3 rounded-full", TW_CHART_COLORS[i])}
            ></span>
            <span>{d.label}</span>
          </p>
        ))}
      </div>
    </div>
  );
};
HorizontalBarChart.displayName = "HorizontalBarChart/Breakdown";

export default HorizontalBarChart;
