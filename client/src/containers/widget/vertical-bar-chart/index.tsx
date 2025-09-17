"use client";
import { FC, useRef } from "react";

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

const getRadius = (
  index: number,
  total: number,
): [number, number, number, number] => {
  if (index === 0) return [8, 8, 0, 16];
  if (index === total - 1) return [8, 8, 16, 0];
  return [8, 8, 0, 0];
};

interface VerticalBarChartProps {
  indicator: string;
  data: Record<string, number>[];
  colors?: (string | number)[];
}

const VerticalBarChart: FC<VerticalBarChartProps> = ({
  indicator,
  data,
  colors,
}) => {
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
      className={cn(CHART_CONTAINER_CLASS_NAME, "h-full overflow-hidden")}
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
                <div className="space-y-2">
                  <p className="grid grid-cols-2 gap-2">
                    <span className="flex flex-1 justify-end">Year</span>
                    <span className="flex flex-1 justify-start font-bold">
                      {payload[0].payload.year}
                    </span>
                  </p>
                  {payload.map((p) => (
                    <p
                      key={`tooltip-item-${p.name}-${p.value}`}
                      className="grid grid-cols-2 gap-2"
                    >
                      <span className="flex flex-1 justify-end">{p.name}</span>
                      <span className="flex flex-1 justify-start font-bold">
                        {formatNumber(Number(p.value), {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </p>
                  ))}
                </div>
              )}
            />
          }
        />
        {!colors && (
          <Bar dataKey="value" name={indicator}>
            {data.map((entry, index) => {
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
        )}
        {colors?.map((c, i) => (
          <Bar dataKey={c} key={`bar-${c}`}>
            {data.map((entry, index) => {
              return (
                <Cell
                  key={`cell-${entry.year}-${index}`}
                  fill={`hsl(var(--chart-${i + 1}))`}
                  // @ts-expect-error - Recharts Cell radius prop accepts [number, number, number, number] for corner radius
                  // but its type definition only allows string | number | undefined
                  radius={getRadius(index, data.length)}
                />
              );
            })}
          </Bar>
        ))}
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
