"use client";
import { FC, useState } from "react";

import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import { cn, formatAndRoundUp } from "@/lib/utils";

import NoData from "@/containers/no-data";
import {
  BAR_GAP,
  CHART_CONTAINER_CLASS_NAME,
  CHART_MARGIN,
  CHART_STYLES,
} from "@/containers/widget/constants";
import ProjectionsTooltip from "@/containers/widget/tooltip/projections";
import { getIndexOfLargestValue } from "@/containers/widget/utils";

import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
} from "@/components/ui/chart";

const getRadius = (
  index: number,
  total: number,
): [number, number, number, number] => {
  if (index === 0) return [8, 8, 0, 16];
  if (index === total - 1) return [8, 8, 16, 0];
  return [8, 8, 0, 0];
};

interface VerticalBarChartProps {
  indicator: string;
  unit: string;
  data: Record<string, number>[];
  colors?: (string | number)[];
  enableHoverStyles?: boolean;
}

const VerticalBarChart: FC<VerticalBarChartProps> = ({
  indicator,
  unit,
  data,
  colors,
  enableHoverStyles,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    console.error(
      `VerticalBarChart: Expected at least 1 data point, but received 0.`,
    );
    return <NoData />;
  }

  const highestValueIndex = getIndexOfLargestValue(data);

  return (
    <ChartContainer
      config={{}}
      className={cn(CHART_CONTAINER_CLASS_NAME, "h-full overflow-hidden")}
      style={CHART_STYLES}
    >
      <BarChart
        margin={CHART_MARGIN}
        data={data}
        layout="horizontal"
        barCategoryGap={BAR_GAP}
        onMouseMove={(state) => {
          if (
            state.isTooltipActive &&
            typeof state.activeTooltipIndex === "number"
          ) {
            setHoveredIndex(state.activeTooltipIndex);
          } else {
            setHoveredIndex(null);
          }
        }}
        onMouseLeave={() => setHoveredIndex(null)}
        accessibilityLayer
      >
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              className="rounded-2xl border-none px-4 py-2 [&>*:nth-child(2)]:hidden"
              formatter={() => null}
              labelFormatter={(_, payload) => (
                <ProjectionsTooltip payload={payload} unit={unit} />
              )}
            />
          }
        />
        {!colors && (
          <Bar dataKey="value" name={indicator}>
            {data.map((entry, index) => {
              return (
                <Cell
                  key={`cell-${entry.year}-${index}`}
                  fill={
                    enableHoverStyles && index === hoveredIndex
                      ? "#fff"
                      : index === highestValueIndex
                        ? "hsl(var(--accent))"
                        : "hsl(var(--secondary))"
                  }
                  className="transition-colors"
                  // @ts-expect-error - Recharts Cell radius prop accepts [number, number, number, number] for corner radius
                  // but its type definition only allows string | number | undefined
                  radius={getRadius(index, data.length)}
                />
              );
            })}
          </Bar>
        )}
        {colors?.map((c, i) => (
          <Bar dataKey={c} key={`bar-${c}`}>
            {data.map((entry, index) => {
              return (
                <Cell
                  key={`cell-${entry.year}-${index}`}
                  fill={`hsl(var(--chart-${i + 1}))`}
                  // @ts-expect-error - Recharts Cell radius prop accepts [number, number, number, number] for corner radius
                  // but its type definition only allows string | number | undefined
                  radius={getRadius(index, data.length)}
                />
              );
            })}
          </Bar>
        ))}
        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={false}
          tickMargin={-30}
          interval="preserveStartEnd"
          tickFormatter={(value) => (value % 10 === 0 ? value : "")}
          tick={({ x, y, payload, index }) => {
            const isHovered = index === hoveredIndex;
            if (payload.value % 10 === 0) {
              return (
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="hanging"
                  className="transition-all"
                  style={{
                    fill:
                      enableHoverStyles && isHovered
                        ? "hsl(var(--background))"
                        : "hsl(var(--foreground))",
                    transition: "fill 0.2s",
                  }}
                >
                  {payload.value}
                </text>
              );
            }
            return <path />;
          }}
        />

        <YAxis
          type="number"
          orientation="right"
          axisLine={false}
          tickLine={false}
          style={{ transform: "translate(30px, -10px)" }}
          tick={({ x, y, payload }) => (
            <text x={x + 30} y={y} textAnchor="end" style={{ fontSize: 12 }}>
              {formatAndRoundUp(payload.value)}
            </text>
          )}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default VerticalBarChart;
