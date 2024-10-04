"use client";
import { FC } from "react";

import { WidgetData } from "@shared/dto/widgets/base-widget-data.interface";
import { Pie, PieChart as RePieChart } from "recharts";

import { cn } from "@/lib/utils";

import { ChartContainer } from "@/components/ui/chart";

const CHART_COLORS = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
] as const;

interface PieChartProps {
  data: WidgetData;
}

const PieChart: FC<PieChartProps> = ({ data }) => {
  return (
    <div className="flex flex-1 gap-x-8 pl-6">
      <ChartContainer config={{}} className="aspect-square min-h-[200px]">
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
      <div className="flex flex-1 items-center">
        <div className="space-y-2">
          {data.map((c, i) => (
            <p
              key={`piechart-label-${c.label}`}
              className="flex items-center gap-x-1 text-xs"
            >
              <span
                className={cn("block h-3 w-3 rounded-full", CHART_COLORS[i])}
              ></span>
              <span className="font-black">{c.value}%</span>
              <span>{c.label}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;
