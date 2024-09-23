"use client";
import { FC } from "react";

import { Pie, PieChart as RePieChart } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export const description = "A donut chart";

const chartData = [
  {
    label: "Mid-level professionals",
    value: 72,
    fill: "hsl(var(--chart-1))",
  },
  { label: "Experts", value: 15, fill: "hsl(var(--chart-2))" },
  {
    label: "Early-career/Entry level",
    value: 13,
    fill: "hsl(var(--chart-3))",
  },
  { label: "Middled-aged (25-50)", value: 13, fill: "hsl(var(--chart-4))" },
];

const chartConfig = {
  chart1: {
    label: "Mid-level professionals",
    color: "hsl(var(--chart-1))",
  },
  chart2: {
    label: "Experts",
    color: "hsl(var(--chart-2))",
  },
  chart3: {
    label: "Early-career/Entry level",
    color: "hsl(var(--chart-3))",
  },
  chart4: {
    label: "Middled-aged (25-50)",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const CHART_COLORS = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
] as const;

function getChartColor(index: number) {
  return CHART_COLORS[index];
}
const PieChart: FC = () => {
  console.log("show me");
  return (
    <div className="flex flex-1 items-center gap-x-8">
      <ChartContainer
        config={chartConfig}
        className="aspect-square min-h-[200px]"
      >
        <RePieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="label"
            innerRadius={40}
          />
        </RePieChart>
      </ChartContainer>
      <div className="space-y-2">
        {chartData.map((c, i) => (
          <p className="flex items-center gap-x-1 text-xs">
            <span
              className={cn("block h-3 w-3 rounded-full", getChartColor(i))}
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
