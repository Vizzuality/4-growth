import {
  BubbleProjection,
  CustomProjection,
} from "@shared/dto/projections/custom-projection.type";
import { ProjectionWidgetData } from "@shared/dto/projections/projection-widget.entity";
import { WidgetChartData } from "@shared/dto/widgets/base-widget-data.interface";
import { CustomProjectionSettingsType } from "@shared/schemas/custom-projection-settings.schema";

import { isBubbleChartSettings } from "@/containers/sidebar/projections-settings/utils";

export function getIndexOfLargestValue(
  data: WidgetChartData | ProjectionWidgetData[] | Record<string, number>[],
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

export function getSimpleChartProps(data: CustomProjection) {
  const chartData: Record<string, number>[] = [];
  const years = Array.from(new Set(data.map((p) => p.year)));
  const colors = Array.from(new Set(data.map((p) => p.color)));

  years.forEach((year) => {
    const values = data.filter((d) => d.year === year);
    const obj = values.reduce(
      (acc, curr) => ({ ...acc, [curr.color]: curr.vertical }),
      {},
    );
    chartData.push({ year, ...obj });
  });

  return { data: chartData, colors };
}
