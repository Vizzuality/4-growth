"use client";
import { FC, useRef } from "react";

import { ProjectionWidgetData } from "@shared/dto/projections/projection-widget.entity";
import { Bar, BarChart, Cell, XAxis } from "recharts";

import { cn, formatNumber } from "@/lib/utils";

import useTickMargin from "@/hooks/use-tick-margin";

import NoData from "@/containers/no-data";
import {
  BAR_GAP,
  CHART_CONTAINER_CLASS_NAME,
  CHART_MARGIN,
  CHART_STYLES,
} from "@/containers/widget/constants";
import { getIndexOfLargestValue } from "@/containers/widget/utils";

import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
} from "@/components/ui/chart";

interface VerticalBarChartProps {
  indicator: string;
  data?: ProjectionWidgetData[];
}

const VerticalBarChart: FC<VerticalBarChartProps> = ({ indicator, data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const tickMargin = useTickMargin(chartRef);

  if (!data || data.length === 0) {
    console.error(
      `VerticalBarChart: Expected at least 1 data point, but received 0.`,
    );
    return <NoData />;
  }

  const highestValueIndex = getIndexOfLargestValue(data);

  return (
    <ChartContainer
      config={{}}
      className={cn(CHART_CONTAINER_CLASS_NAME, "overflow-hidden")}
      ref={chartRef}
      style={CHART_STYLES}
    >
      <BarChart
        margin={CHART_MARGIN}
        data={data}
        layout="horizontal"
        barCategoryGap={BAR_GAP}
        accessibilityLayer
      >
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              className="rounded-2xl border-none px-4 py-2 [&>*:nth-child(2)]:hidden"
              formatter={() => null}
              labelFormatter={(_, payload) => (
                <div className="flex gap-2">
                  <p className="flex flex-col items-end justify-end gap-2">
                    <span>Year</span>
                    <span>{indicator}</span>
                  </p>
                  <p className="flex flex-col gap-2">
                    <span className="font-bold">{payload[0].payload.year}</span>
                    <span className="font-bold">
                      {formatNumber(payload[0].payload.value, {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </p>
                </div>
              )}
            />
          }
        />
        <Bar dataKey="value">
          {data.map((entry, index) => {
            const getRadius = (
              index: number,
              total: number,
            ): [number, number, number, number] => {
              if (index === 0) return [8, 8, 0, 16];
              if (index === total - 1) return [8, 8, 16, 0];
              return [8, 8, 0, 0];
            };

            return (
              <Cell
                key={`cell-${entry.year}-${index}`}
                fill={
                  index === highestValueIndex
                    ? "hsl(var(--accent))"
                    : "hsl(var(--secondary))"
                }
                // @ts-expect-error - Recharts Cell radius prop accepts [number, number, number, number] for corner radius
                // but its type definition only allows string | number | undefined
                radius={getRadius(index, data.length)}
              />
            );
          })}
        </Bar>
        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={false}
          tickMargin={tickMargin}
          tickFormatter={(value) => (value % 10 === 0 ? value : "")}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default VerticalBarChart;
