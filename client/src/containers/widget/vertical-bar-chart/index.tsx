"use client";
import { FC, useRef, useEffect, useState } from "react";

import { Bar, BarChart, Cell, XAxis } from "recharts";

import { formatNumber } from "@/lib/utils";

import NoData from "@/containers/no-data";
import { getIndexOfLargestValue } from "@/containers/widget/utils";

import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
} from "@/components/ui/chart";

// TODO: Replace this type when backend provides the correct one
type ProjectionsData = Array<{
  year: number;
  value: number;
}>;
interface VerticalBarChartProps {
  indicator: string;
  data?: ProjectionsData;
}

// BAR_GAP is explicitly set to compensate for the default spacing at chart edges
// This ensures consistent bar spacing across the entire chart width
const BAR_GAP = 2;
const VerticalBarChart: FC<VerticalBarChartProps> = ({ indicator, data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [tickMargin, setTickMargin] = useState<number>(0);

  useEffect(() => {
    const updateTickMargin = () => {
      if (chartRef.current) {
        const chartHeight = chartRef.current.clientHeight;
        setTickMargin(-(chartHeight * 0.2));
      }
    };

    updateTickMargin();
    window.addEventListener("resize", updateTickMargin);

    return () => {
      window.removeEventListener("resize", updateTickMargin);
    };
  }, []);

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
      // The XAxis component adds default height to the chart container
      // We use negative margin to compensate and keep the chart compact
      // See: https://recharts.org/en-US/api/XAxis#height
      className="-mb-[30px] [&_.recharts-cartesian-axis-tick_text]:fill-foreground [&_.recharts-cartesian-axis-tick_text]:font-medium"
      ref={chartRef}
    >
      <BarChart
        margin={{ top: 0, left: -BAR_GAP, right: -BAR_GAP, bottom: 0 }}
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
