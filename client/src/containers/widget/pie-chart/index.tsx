"use client";
import { FC, useMemo } from "react";

import { WidgetChartData } from "@shared/dto/widgets/base-widget-data.interface";
import { Pie, PieChart as RePieChart } from "recharts";

import { MAX_PIE_CHART_LABELS_COUNT, TW_CHART_COLORS } from "@/lib/constants";
import { cn, formatNumber } from "@/lib/utils";

import NoData from "@/containers/no-data";

import { ChartContainer } from "@/components/ui/chart";

const normalizePieChartData = (data?: WidgetChartData): WidgetChartData => {
  if (!data) return [];
  if (data.length < MAX_PIE_CHART_LABELS_COUNT) return data;

  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const remainingValue = sortedData
    .slice(MAX_PIE_CHART_LABELS_COUNT)
    .reduce((acc, curr) => acc + curr.value, 0);

  return [
    ...sortedData.slice(0, MAX_PIE_CHART_LABELS_COUNT),
    { label: "Others", value: remainingValue, total: data[0].total },
  ];
};
interface PieChartProps {
  data?: WidgetChartData;
  legendPosition?: "bottom" | "right";
  className?: HTMLDivElement["className"];
}

const PieChart: FC<PieChartProps> = ({
  data,
  className,
  legendPosition = "right",
}) => {
  const normalizedData = useMemo(() => normalizePieChartData(data), [data]);

  if (!data || data.length === 0) {
    console.error(`PieChart: Expected at least 1 data point, but received 0.`);
    return <NoData />;
  }

  return (
    <div
      className={cn({
        "flex flex-1 gap-x-8 pl-6": true,
        "min-h-0 flex-col justify-between": legendPosition === "bottom",
      })}
    >
      <ChartContainer config={{}} className={className}>
        <RePieChart>
          <Pie
            data={normalizedData.map((d, i) => ({
              ...d,
              fill: `hsl(var(--chart-${i + 1}))`,
            }))}
            dataKey="value"
            nameKey="label"
            innerRadius="65%"
            outerRadius="100%"
          />
        </RePieChart>
      </ChartContainer>
      <div
        className={cn({
          "flex justify-center": true,
          "flex-1 flex-col gap-2": legendPosition === "right",
          "mt-8 flex-row flex-wrap items-start gap-6 pr-6":
            legendPosition === "bottom",
        })}
      >
        {normalizedData.map((c, i) => (
          <p
            key={`piechart-label-${c.label}`}
            className={cn({
              "flex items-start gap-x-1 text-xs": true,
              "flex-1": legendPosition === "bottom",
            })}
          >
            <span className="flex items-center gap-x-1">
              <span
                className={cn("block h-3 w-3 rounded-full", TW_CHART_COLORS[i])}
              ></span>
              <span className="font-black">{formatNumber(c.value)}%</span>
            </span>

            <span>{c.label}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
