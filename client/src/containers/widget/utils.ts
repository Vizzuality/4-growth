import {
  BubbleProjection,
  CustomProjection,
} from "@shared/dto/projections/custom-projection.type";
import { ProjectionWidgetData } from "@shared/dto/projections/projection-widget.entity";
import { WidgetChartData } from "@shared/dto/widgets/base-widget-data.interface";
import { CustomProjectionSettingsType } from "@shared/schemas/custom-projection-settings.schema";

import { isBubbleChartSettings } from "@/containers/sidebar/projections-settings/utils";

export function getIndexOfLargestValue(
  data: WidgetChartData | ProjectionWidgetData[""] | Record<string, number>[],
): number {
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

const getYears = (data: CustomProjection, unit: string): number[] => {
  if (!data[unit]) return [];

  return Array.from(new Set(data[unit].map((p) => p.year)));
};
export function getColors(
  data: CustomProjection,
  unit: string,
): (string | number)[] {
  if (!data[unit]) return [];

  const colorsRaw = Array.from(new Set(data[unit].map((p) => p.color)));
  const colors = colorsRaw.filter((c) => c !== "others");
  if (colorsRaw.includes("others")) colors.push("others");

  return colors;
}

export function getBubbleChartProps(
  data: BubbleProjection,
  unit: string,
  settings: CustomProjectionSettingsType | null,
) {
  const chartData: Record<number, BubbleProjection[""]> = {};
  const years = getYears(data, unit);

  let horizontalLabel: string = "";
  let verticalLabel: string = "";

  if (isBubbleChartSettings(settings)) {
    horizontalLabel = settings.bubble_chart.horizontal;
    verticalLabel = settings.bubble_chart.vertical;
  }

  years.forEach((year) => {
    chartData[year] = data[unit].filter((d) => d.year === year);
  });

  return {
    chartData,
    colors: getColors(data, unit),
    years,
    horizontalLabel,
    verticalLabel,
  };
}

export function getSimpleChartProps(data: CustomProjection, unit: string) {
  const chartData: Record<string, number>[] = [];
  const years = getYears(data, unit);

  years.forEach((year) => {
    const values = data[unit].filter((d) => d.year === year);
    const obj = values.reduce(
      (acc, curr) => ({ ...acc, [curr.color]: curr.vertical }),
      {},
    );
    chartData.push({ year, ...obj });
  });

  return { data: chartData, colors: getColors(data, unit) };
}
