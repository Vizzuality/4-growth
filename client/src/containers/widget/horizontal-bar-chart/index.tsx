"use client";
import { CSSProperties, FC } from "react";

import { WidgetChartData } from "@shared/dto/widgets/base-widget-data.interface";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import NoData from "@/containers/no-data";
import { getIndexOfLargestValue } from "@/containers/widget/utils";

import { ChartContainer } from "@/components/ui/chart";
interface HorizontalBarChartProps {
  data?: WidgetChartData;
  barSize?: number;
}

const HorizontalBarChart: FC<HorizontalBarChartProps> = ({ data, barSize }) => {
  if (!data || data.length === 0) {
    console.error(
      `HorizontalBarChart: Expected at least 1 data point, but received 0.`,
    );
    return <NoData />;
  }
  const height = data.length * 50;
  const highestValueIndex = getIndexOfLargestValue(data);
  let style: CSSProperties = {
    minHeight: "0px",
    width: "60%",
  };

  if (barSize) {
    style = {
      ...style,
      maxHeight: `${height}px`,
    };
  }

  return (
    <ChartContainer config={{}} className="w-full p-0" style={style}>
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
          barSize={barSize}
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
                <tspan fontWeight="bold">{value}</tspan>
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
