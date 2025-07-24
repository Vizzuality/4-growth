import { BubbleProjection } from "@shared/dto/projections/custom-projection.type";
import { CustomProjectionSettingsType } from "@shared/schemas/custom-projection-settings.schema";

import { isBubbleChartSettings } from "@/containers/sidebar/projections-settings/utils";

interface ValueObject {
  value: number;
  [key: string]: string | number;
}

export function getIndexOfLargestValue(data: ValueObject[]): number {
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

export function getBubbleChartProps(
  data: BubbleProjection[],
  settings: CustomProjectionSettingsType | null,
) {
  const chartData: Record<number, BubbleProjection[]> = {};
  const years = Array.from(new Set(data.map((p) => p.year)));
  const colors = Array.from(new Set(data.map((p) => p.color)));
  let horizontalLabel: string = "";
  let verticalLabel: string = "";

  if (isBubbleChartSettings(settings)) {
    horizontalLabel = settings.bubble_chart.horizontal;
    verticalLabel = settings.bubble_chart.vertical;
  }

  years.forEach((year) => {
    chartData[year] = data.filter((d) => d.year === year);
  });

  return { chartData, colors, years, horizontalLabel, verticalLabel };
}
