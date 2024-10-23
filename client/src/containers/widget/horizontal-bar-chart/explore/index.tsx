"use client";
import { FC } from "react";

import { WidgetChartData } from "@shared/dto/widgets/base-widget-data.interface";

import BaseHorizontalBarChart from "@/containers/widget/horizontal-bar-chart";

interface SmallHorizontalBarChartProps {
  data?: WidgetChartData;
}

const HorizontalBarChart: FC<SmallHorizontalBarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    console.warn(
      `HorizontalBarChart: Expected at least 1 data point, but received 0.`,
    );
    return null;
  }

  const height = data.length * 50;

  return (
    <BaseHorizontalBarChart
      data={data}
      height={height}
      barSize={47}
      renderLabel={({ x, y, height, value, index }) => {
        const entry = data[index];
        return (
          <text
            x={x + 24}
            y={y + height / 2}
            fill="#ffffff"
            textAnchor="start"
            dominantBaseline="central"
          >
            <tspan fontSize={10} fontWeight={900}>
              {value}%
            </tspan>
            <tspan fontSize={12} dx="8">
              {entry.label}
            </tspan>
          </text>
        );
      }}
      containerStyle={{ maxHeight: `${height}px`, width: "60%" }}
    />
  );
};

export default HorizontalBarChart;
