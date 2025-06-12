"use client";
import { FC, useRef, useEffect, useState } from "react";

import { Bar, BarChart, Cell, XAxis } from "recharts";

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
  title: string;
  data?: ProjectionsData;
}

const VerticalBarChart: FC<VerticalBarChartProps> = ({ title, data }) => {
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
      className="w-full p-0 [&_.recharts-cartesian-axis-tick_text]:fill-foreground [&_.recharts-cartesian-axis-tick_text]:font-medium"
      ref={chartRef}
    >
      <BarChart
        margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
        data={data}
        layout="horizontal"
        barGap={2}
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
                    <span>{title}</span>
                  </p>
                  <p className="flex flex-col gap-2">
                    <span className="font-bold">{payload[0].payload.year}</span>
                    <span className="font-bold">
                      {payload[0].payload.value}
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
              if (index === 0) return [8, 8, 0, 50];
              if (index === total - 1) return [8, 8, 50, 0];
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
