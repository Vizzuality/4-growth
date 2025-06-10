import { FC, useMemo } from "react";

import { WidgetChartData } from "@shared/dto/widgets/base-widget-data.interface";

import { cn } from "@/lib/utils";
import NoData from "@/containers/no-data";

interface AreaChartProps {
  indicator: string;
  data?: WidgetChartData;
}

const getAreaChartCategories = (
  data: WidgetChartData,
): Record<"yes" | "no" | "dontKnow", WidgetChartData[number] | undefined> => {
  const categories: Record<
    "yes" | "no" | "dontKnow",
    WidgetChartData[number] | undefined
  > = {
    yes: undefined,
    no: undefined,
    dontKnow: undefined,
  };

  data.forEach((item) => {
    if (item.label === "Yes") categories.yes = item;
    else if (item.label === "No") categories.no = item;
    else categories.dontKnow = item;
  });

  return categories;
};

const AreaChart: FC<AreaChartProps> = ({ indicator, data }) => {
  if (!data || data.length === 0 || data.length > 3) {
    console.error(
      `AreaChart (${indicator}): Invalid data format. The chart requires 1-3 data points, but received ${data?.length || 0} points.`,
    );
    return <NoData />;
  }

  const categories = useMemo(() => getAreaChartCategories(data), [data]);
  return (
    <div className="relative flex h-full items-end">
      <div className="absolute left-6 top-6 z-10 h-[calc(100%_-_3rem)] w-[calc(100%_-_3rem)]">
        <div className="flex h-full flex-col justify-end">
          <div className="flex items-end justify-between">
            {categories.yes && (
              <p className="text-2xl font-semibold">{categories.yes.value}%</p>
            )}
            <div className="text-xs font-bold">
              {categories.no && (
                <p>
                  {categories.no.label} {categories.no.value}%
                </p>
              )}
              {categories.dontKnow && (
                <p>
                  {categories.dontKnow.label} {categories.dontKnow.value}%
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {Object.values(categories)
        .filter((item): item is WidgetChartData[number] => item !== undefined)
        .map((a, i) => (
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
