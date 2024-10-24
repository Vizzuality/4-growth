"use client";
import React, { FC, useState } from "react";

import { WidgetChartData } from "@shared/dto/widgets/base-widget-data.interface";
import { useDebouncedCallback } from "use-debounce";

import NoData from "@/containers/no-data";
import BaseHorizontalBarChart, {
  hasChartData,
} from "@/containers/widget/horizontal-bar-chart";

interface LargeHorizontalBarChartProps {
  data?: WidgetChartData;
}

const getTextWidth = (text: string) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  return context ? context.measureText(text).width : 0;
};

const LEFT_PADDING = 24;

const HorizontalBarChart: FC<LargeHorizontalBarChartProps> = ({ data }) => {
  const height = (data && data.length * 50) || 0;
  const [chartWidth, setChartWidth] = useState(0);
  const debouncedSetChartWidth = useDebouncedCallback((width: number) => {
    setChartWidth(width);
  }, 200);

  if (!hasChartData(data, HorizontalBarChart.displayName)) {
    return <NoData />;
  }

  return (
    <BaseHorizontalBarChart
      data={data}
      width={chartWidth}
      height={height}
      onResize={debouncedSetChartWidth}
      renderLabel={({ y, height, value, index }) => {
        const entry = data[index];
        const labelWidth = getTextWidth(entry.label || "") + 8;
        const valueWidth = getTextWidth(`${value}%`) + 8;
        return (
          <g key={`label-group-${index}`}>
            <text
              x={LEFT_PADDING}
              y={y + height / 2}
              fill="#ffffff"
              textAnchor="start"
              dominantBaseline="central"
              fontSize={12}
            >
              {entry.label}
            </text>
            <line
              x1={LEFT_PADDING + labelWidth}
              y1={y + height / 2}
              x2={chartWidth - valueWidth}
              y2={y + height / 2}
              stroke="#ffffff"
              strokeWidth={1}
              opacity={0.2}
              strokeDasharray="3 3"
            />
            <text
              x={chartWidth}
              y={y + height / 2}
              fill="#ffffff"
              textAnchor="end"
              dominantBaseline="central"
              fontSize={10}
              fontWeight={900}
            >
              {value}%
            </text>
          </g>
        );
      }}
    />
  );
};
HorizontalBarChart.displayName = "HorizontalBarChart/Sandbox";

export default HorizontalBarChart;
