"use client";
import { FC } from "react";

import { WidgetChartData } from "@shared/dto/widgets/base-widget-data.interface";
import { Pie, PieChart as RePieChart } from "recharts";

import { TW_CHART_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { ChartContainer } from "@/components/ui/chart";

interface PieChartProps {
  data?: WidgetChartData;
}

const PieChart: FC<PieChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    console.warn(`PieChart: Expected at least 1 data point, but received 0.`);
    return null;
  }

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
                className={cn("block h-3 w-3 rounded-full", TW_CHART_COLORS[i])}
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
