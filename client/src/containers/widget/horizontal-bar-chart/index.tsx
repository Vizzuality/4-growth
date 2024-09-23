import { FC } from "react";

import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartData = [
  { month: "January", value: 186 },
  { month: "February", value: 305 },
  { month: "March", value: 237 },
  { month: "April", value: 73 },
  { month: "May", value: 209 },
  { month: "June", value: 214 },
];

const chartConfig = {
  value: {
    label: "Desktop",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const HorizontalBarChart: FC = () => {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full p-0">
      <BarChart
        margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
        data={chartData}
        layout="vertical"
        accessibilityLayer
      >
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="month" hide />
        <Bar
          dataKey="value"
          // fill="hsl(var(--accent))"
          fill="hsl(var(--secondary))"
          radius={[0, 8, 8, 0]}
          label={({ x, y, height, value, index }) => {
            const entry = chartData[index];

            return (
              <text
                x={x + 24}
                y={y + height / 2}
                fill="#ffffff"
                textAnchor="start"
                dominantBaseline="central"
                fontSize={12}
              >
                <tspan fontWeight="bold">{value}%</tspan>
                <tspan dx="8">{entry.month}</tspan>
              </text>
            );
          }}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${entry.month}-${index}`} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export default HorizontalBarChart;
