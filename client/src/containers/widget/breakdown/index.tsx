"use client";
import React, { FC } from "react";

import { WidgetChartData } from "@shared/dto/widgets/base-widget-data.interface";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import { CSS_CHART_COLORS, TW_CHART_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import NoData from "@/containers/no-data";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface BreakdownProps {
  data?: { label: string; data: WidgetChartData }[];
}

const Breakdown: FC<BreakdownProps> = ({ data }) => {
  if (!data || data.length === 0) {
    console.warn(`Breakdown: Expected at least 1 data point, but received 0.`);
    return <NoData />;
  }

  return (
    <div className="breakdown-chart space-y-10">
      {data.map((d) => {
        const height = d.data.length * 10;

        return (
          <div key={`breakdown-chart-${d.label}`}>
            <p className="mb-1 pl-6 text-xs">{d.label}</p>
            <ChartContainer
              config={{}}
              className="w-full p-0"
              style={{ maxHeight: `${height}px` }}
            >
              <BarChart
                height={height}
                margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
                data={d.data}
                layout="vertical"
                barGap={2}
                accessibilityLayer
              >
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="label" hide />
                <Bar barSize={7} dataKey="value" radius={[0, 5, 5, 0]}>
                  {d.data.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.label}-${index}`}
                      fill={CSS_CHART_COLORS[index]}
                    />
                  ))}
                </Bar>
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
              </BarChart>
            </ChartContainer>
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

export default Breakdown;
