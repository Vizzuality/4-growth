import { FC } from "react";

import { WidgetChartData } from "@shared/dto/widgets/base-widget-data.interface";

import { cn } from "@/lib/utils";

interface AreaChartProps {
  indicator: string;
  data?: WidgetChartData;
}

const AreaChart: FC<AreaChartProps> = ({ indicator, data }) => {
  if (data?.length !== 3) {
    console.warn(
      `AreaChart - ${indicator}: Expected exactly 3 data points, but received ${data?.length}.`,
    );
    return null;
  }

  return (
    <div className="relative flex h-full items-end">
      <div className="absolute left-6 top-6 z-10 h-[calc(100%_-_3rem)] w-[calc(100%_-_3rem)]">
        <div className="flex h-full flex-col justify-end">
          <div className="flex items-end justify-between">
            <p className="text-2xl font-semibold">{data[0].value}%</p>
            <div className="text-xs font-bold">
              <p>
                {data[1].label} {data[1].value}%
              </p>
              <p>
                {data[2].label} {data[2].value}%
              </p>
            </div>
          </div>
        </div>
      </div>
      {data.map((a, i) => (
        <div
          key={`area-chart-${indicator}-${a.label}-${a.value}`}
          data-testid="area-chart-segment"
          style={{ width: `${a.value}%` }}
          className={cn(
            "flex h-full flex-col justify-end",
            i === 0 && "bg-secondary",
            i === 2 &&
              "bg-secondary bg-[url('/images/area-graph-pattern.png')] bg-blend-multiply [transform:scaleX(-1)_rotate(-180deg)]",
          )}
        ></div>
      ))}
    </div>
  );
};

export default AreaChart;
