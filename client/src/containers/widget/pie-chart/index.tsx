"use client";
import { FC } from "react";

import { WidgetChartData } from "@shared/dto/widgets/base-widget-data.interface";
import { Pie, PieChart as RePieChart } from "recharts";

import { TW_CHART_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { ChartContainer } from "@/components/ui/chart";

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
  if (!data || data.length === 0) {
    console.warn(`PieChart: Expected at least 1 data point, but received 0.`);
    return null;
  }

  return (
    <div
      className={cn({
        "flex flex-1 gap-x-8 pl-6": true,
        "min-h-0 flex-col": legendPosition === "bottom",
      })}
    >
      <ChartContainer config={{}} className={className}>
        <RePieChart>
          <Pie
            data={data.map((d, i) => ({
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
          "mt-8 flex-row items-start gap-6": legendPosition === "bottom",
        })}
      >
        {data.map((c, i) => (
          <p
            key={`piechart-label-${c.label}`}
            className="flex items-center gap-x-1 text-xs"
          >
            <span
              className={cn("block h-3 w-3 rounded-full", TW_CHART_COLORS[i])}
            ></span>
            <span className="font-black">{c.value}%</span>
            <span>{c.label}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
