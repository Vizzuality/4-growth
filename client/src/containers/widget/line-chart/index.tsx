import { FC } from "react";

import { Line, LineChart as ReLinChart, XAxis, YAxis } from "recharts";
import { DataKey } from "recharts/types/util/types";

import { cn, formatAndRoundUp } from "@/lib/utils";

import NoData from "@/containers/no-data";
import { CHART_CONTAINER_CLASS_NAME } from "@/containers/widget/constants";
import ProjectionsTooltip from "@/containers/widget/tooltip/projections";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface LineChartProps {
  indicator: string;
  unit: string;
  dataKey: DataKey<Record<string, string>>;
  data: Record<string, number>[];
  colors?: (string | number)[];
}
const LineChart: FC<LineChartProps> = ({
  indicator,
  unit,
  dataKey,
  data,
  colors,
}) => {
  if (!data || data.length === 0) {
    console.error(`LineChart: Expected at least 1 data point, but received 0.`);
    return <NoData />;
  }

  return (
    <ChartContainer
      config={{}}
      className={cn("h-full overflow-hidden", CHART_CONTAINER_CLASS_NAME)}
    >
      <ReLinChart data={data} accessibilityLayer>
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
          <Line
            name={indicator}
            dataKey={dataKey}
            type="linear"
            strokeWidth={10}
            stroke="hsl(var(--secondary))"
            dot={false}
          />
        )}
        {colors?.map((c, i) => (
          <Line
            key={`line-${c}`}
            dataKey={c}
            type="linear"
            strokeWidth={10}
            stroke={`hsl(var(--chart-${i + 1}))`}
            dot={false}
          />
        ))}

        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          tick={(props) => {
            const { x, y, payload } = props;

            if (payload.value % 10 === 0) {
              const firstTick = data[0].year === payload.value;
              const lastTick = data[data.length - 1].year === payload.value;
              const margin = firstTick ? 8 : lastTick ? -8 : 0;
              return (
                <text
                  x={x + margin}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="hanging"
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
          tick={({ x, y, payload }) => (
            <text x={x + 30} y={y} textAnchor="end" style={{ fontSize: 12 }}>
              {formatAndRoundUp(payload.value)}
            </text>
          )}
        />
      </ReLinChart>
    </ChartContainer>
  );
};

export default LineChart;
