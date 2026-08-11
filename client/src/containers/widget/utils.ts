import {
  BubbleProjection,
  CustomProjection,
  SimpleProjection,
} from "@shared/dto/projections/custom-projection.type";
import { ProjectionWidgetData } from "@shared/dto/projections/projection-widget.entity";
import { WidgetChartData } from "@shared/dto/widgets/base-widget-data.interface";
import { CustomProjectionSettingsType } from "@shared/schemas/custom-projection-settings.schema";

import { isBubbleChartSettings } from "@/containers/sidebar/projections-settings/utils";

/**
 * Advance widths in px for Inter at 10px/900 under `tabular-nums`, measured with
 * `getComputedTextLength`. Tabular figures give every digit one advance, so
 * summing per-glyph widths reproduces the rendered width exactly rather than
 * approximating it — which is what lets a percentage be laid out without
 * measuring it in the DOM first.
 */
const PERCENT_GLYPH_WIDTH = {
  digit: 6.445,
  decimalSeparator: 2.688,
  percentSign: 10.445,
} as const;

const measurePercent = (value: string): number =>
  [...value].reduce<number>(
    (width, char) =>
      width +
      (char >= "0" && char <= "9"
        ? PERCENT_GLYPH_WIDTH.digit
        : PERCENT_GLYPH_WIDTH.decimalSeparator),
    PERCENT_GLYPH_WIDTH.percentSign,
  );

/**
 * Where a label may start so it clears every percentage in the chart by `gap`.
 * Sized to the widest value present rather than the widest value possible, and
 * shared by every row, so the labels stay in one column.
 */
export function getPercentLabelInset(
  values: string[],
  { inset, gap }: { inset: number; gap: number },
): number {
  return Math.ceil(inset + Math.max(0, ...values.map(measurePercent)) + gap);
}

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

const getYears = (
  data: SimpleProjection | BubbleProjection,
  unit: string,
): number[] => {
  if (!data[unit]) return [];

  return Array.from(new Set(data[unit].map((p) => p.year)));
};
export function getColors(
  data: SimpleProjection | BubbleProjection,
  unit: string,
): (string | number)[] {
  if (!data[unit]) return [];

  const colorsRaw = Array.from(new Set(data[unit].map((p) => p.color)));
  const colors = colorsRaw.filter((c) => c !== "Others");
  if (colorsRaw.includes("Others")) colors.push("Others");

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

export function getSimpleChartProps(data: SimpleProjection, unit: string) {
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

export function getDefaultProjectionUnit(
  data?: ProjectionWidgetData | CustomProjection,
  indicator?: string,
): string {
  if (data && "Units" in data && indicator === "Shipments") return "Units";

  if (!data || "EUR" in data) return "EUR";

  return Object.keys(data)[0];
}
