"use client";
import { FC, useRef } from "react";

import { ProjectionWidgetData } from "@shared/dto/projections/projection-widget.entity";
import { Area, AreaChart, XAxis } from "recharts";

import { formatNumber } from "@/lib/utils";

import useTickMargin from "@/hooks/use-tick-margin";

import NoData from "@/containers/no-data";
import {
  BAR_GAP,
  CHART_CONTAINER_CLASS_NAME,
  CHART_MARGIN,
  CHART_STYLES,
} from "@/containers/widget/constants";

import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
} from "@/components/ui/chart";

interface AreaChartChartProps {
  indicator: string;
  data?: ProjectionWidgetData[];
}

const AreaChartComponent: FC<AreaChartChartProps> = ({ indicator, data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const tickMargin = useTickMargin(chartRef);

  if (!data || data.length === 0) {
    return <NoData />;
  }

  return (
    <ChartContainer
      config={{}}
      className={CHART_CONTAINER_CLASS_NAME}
      ref={chartRef}
      style={CHART_STYLES}
    >
      <AreaChart
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
        <Area
          type="linear"
          dataKey="value"
          fill="hsl(var(--secondary))"
          fillOpacity={1}
          strokeWidth={0}
          activeDot={false}
        />
        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={false}
          tickMargin={tickMargin}
          interval="preserveStartEnd"
          tick={(props) => {
            const { x, y, payload } = props;

            if (payload.value % 10 === 0) {
              const firstTick = data[0].year === payload.value;
              const lastTick = data[data.length - 1].year === payload.value;
              const margin = firstTick ? 8 : lastTick ? -8 : 0;
              return (
                <text
                  x={x + margin}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="hanging"
                >
                  {payload.value}
                </text>
              );
            }

            return <path />;
          }}
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default AreaChartComponent;
