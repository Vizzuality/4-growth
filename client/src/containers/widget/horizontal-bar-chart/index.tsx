import React, { FC } from "react";

import { WidgetChartData } from "@shared/dto/widgets/base-widget-data.interface";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { ImplicitLabelType } from "recharts/types/component/Label";

import { ChartContainer } from "@/components/ui/chart";

interface HorizontalBarChartProps {
  data: WidgetChartData;
  width?: number;
  height: number;
  barSize?: number;
  renderLabel?: ImplicitLabelType;
  containerStyle?: React.CSSProperties;
  barRadius?: [number, number, number, number];
  renderTooltip?: React.ReactNode;
  getCellColor?: (index: number) => string;
}

function getValueIndexFromWidgetData(data: WidgetChartData) {
  return data.reduce(
    (maxIndex, current, index, arr) =>
      current.value > arr[maxIndex].value ? index : maxIndex,
    0,
  );
}

const HorizontalBarChart: FC<HorizontalBarChartProps> = ({
  data,
  width,
  height,
  barSize,
  renderLabel,
  containerStyle,
  barRadius = [0, 8, 8, 0],
  renderTooltip,
  getCellColor,
}) => {
  const highestValueIndex = getValueIndexFromWidgetData(data);
  const defaultGetCellColor = (index: number) =>
    index === highestValueIndex
      ? "hsl(var(--accent))"
      : "hsl(var(--secondary))";

  return (
    <ChartContainer config={{}} className="w-full p-0" style={containerStyle}>
      <BarChart
        width={width}
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
          radius={barRadius}
          label={renderLabel}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.label}-${index}`}
              fill={(getCellColor || defaultGetCellColor)(index)}
            />
          ))}
        </Bar>
        {renderTooltip}
      </BarChart>
    </ChartContainer>
  );
};

export function hasChartData<T>(data?: T[], name?: string): data is T[] {
  if (!data || data.length === 0) {
    console.warn(`${name}: Expected at least 1 data point, but received 0.`);
    return false;
  }
  return true;
}

export default HorizontalBarChart;
