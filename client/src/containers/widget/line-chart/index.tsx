import { FC } from "react";

import { Line, LineChart as ReLinChart, XAxis, YAxis } from "recharts";
import { DataKey } from "recharts/types/util/types";

import { cn, formatNumber } from "@/lib/utils";

import NoData from "@/containers/no-data";
import { CHART_CONTAINER_CLASS_NAME } from "@/containers/widget/constants";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface LineChartProps {
  indicator: string;
  dataKey: DataKey<Record<string, string>>;
  data: Record<string, number>[];
  colors?: (string | number)[];
}
const LineChart: FC<LineChartProps> = ({
  indicator,
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
                <div className="space-y-2">
                  <p className="grid grid-cols-2 gap-2">
                    <span className="flex flex-1 justify-end">Year</span>
                    <span className="flex flex-1 justify-start font-bold">
                      {payload[0].payload.year}
                    </span>
                  </p>
                  {payload.map((p) => (
                    <p
                      key={`tooltip-item-${p.name}-${p.value}`}
                      className="grid grid-cols-2 gap-2"
                    >
                      <span className="flex flex-1 justify-end">{p.name}</span>
                      <span className="flex flex-1 justify-start font-bold">
                        {formatNumber(Number(p.value), {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </p>
                  ))}
                </div>
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
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => {
            const roundedUp = Math.ceil(value / 1000000000) * 1000000000;
            return formatNumber(roundedUp, {
              maximumFractionDigits: 0,
              notation: "compact",
              compactDisplay: "short",
            });
          }}
        />
      </ReLinChart>
    </ChartContainer>
  );
};

export default LineChart;
