import { FC } from "react";

import { WidgetChartData } from "@shared/dto/widgets/base-widget-data.interface";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import { ChartContainer } from "@/components/ui/chart";

interface HorizontalBarChartProps {
  data?: WidgetChartData;
}

function getValueIndexFromWidgetData(data: WidgetChartData) {
  let index = 0;
  let largestValue = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i].value > largestValue) {
      largestValue = data[i].value;
      index = i;
    }
  }

  return index;
}
const HorizontalBarChart: FC<HorizontalBarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    console.warn(
      `HorizontalBarChart: Expected at least 1 data point, but received 0.`,
    );
    return null;
  }

  const height = data.length * 50;
  const highestValueIndex = getValueIndexFromWidgetData(data);
  return (
    <ChartContainer
      config={{}}
      className="w-full p-0"
      style={{ maxHeight: `${height}px`, width: "60%" }}
    >
      <BarChart
        height={height}
        margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
        data={data}
        layout="vertical"
        barGap={2}
        accessibilityLayer
      >
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="label" hide />
        <Bar
          barSize={47}
          dataKey="value"
          radius={[0, 8, 8, 0]}
          label={({ x, y, height, value, index }) => {
            const entry = data[index];

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
                <tspan dx="8">{entry.label}</tspan>
              </text>
            );
          }}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.label}-${index}`}
              fill={
                index === highestValueIndex
                  ? "hsl(var(--accent))"
                  : "hsl(var(--secondary))"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export default HorizontalBarChart;
