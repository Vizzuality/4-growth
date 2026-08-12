import {
  WidgetChartData,
  WidgetData,
  WidgetMapData,
} from "@shared/dto/widgets/base-widget-data.interface";

import { NA_ANSWER_LABEL } from "@/lib/constants";

/**
 * Function that transforms raw count values into percentages
 */
function normalizeWidgetData(widgetData: WidgetData): WidgetData {
  const result = { ...widgetData };

  if (result.map) {
    result.map = normalizeMapData(result.map);
  }

  if (result.chart) {
    result.chart = normalizeChartData(result.chart);
  }

  if (result.breakdown) {
    result.breakdown = result.breakdown
      .map((b) => ({
        ...b,
        data: normalizeChartData(b.data),
      }))
      .filter((d) => d.label !== NA_ANSWER_LABEL);
  }

  // Normalized per source, so each one sums to 100% against its own total rather
  // than against the combined total — otherwise the smaller source always looks
  // negligible regardless of its distribution.
  if (result.bySource) {
    result.bySource = result.bySource.map((s) => ({
      ...s,
      data: {
        ...s.data,
        ...(s.data.chart ? { chart: normalizeChartData(s.data.chart) } : {}),
      },
    }));
  }

  return result;
}

/**
 * Calculates the response rate in percentage
 */
function getResponseRate(data: WidgetData) {
  if (!data.chart || data.chart.length === 0) return 0;

  const total = data.chart[0].total;
  const totalWithoutNA = calculateTotalWithoutNA(data.chart);

  return Math.round((totalWithoutNA / total) * 100);
}

/**
 * Calculates the absolute value of the widget
 */
function getAbsoluteValue(data: WidgetData) {
  if (!data.chart || data.chart.length === 0) return 0;

  return calculateTotalWithoutNA(data.chart);
}

/**
 * Calculates percentage values for map data based on total count
 */
function normalizeMapData(mapData: WidgetMapData): WidgetMapData {
  const totalCount = calculateMapTotal(mapData);

  return mapData.map((entry) => ({
    ...entry,
    value: calculatePercentage(entry.value, totalCount),
  }));
}

/**
 * Calculates the total sum of values in map data
 */
function calculateMapTotal(mapData: WidgetMapData): number {
  return mapData.reduce((sum, entry) => sum + entry.value, 0);
}

/**
 * Calculates the total sum of values without N/A values
 */
function calculateTotalWithoutNA(chartData: WidgetChartData): number {
  return chartData.reduce(
    (acc, curr) => (curr.label !== NA_ANSWER_LABEL ? acc + curr.value : acc),
    0,
  );
}

/**
 * Calculates percentage values for chart data using the total value
 * without N/A, plus filters out N/A from the array
 */
function normalizeChartData(chartData: WidgetChartData): WidgetChartData {
  const totalWithoutNA = calculateTotalWithoutNA(chartData);

  return removeNaLabels(
    chartData.map((entry) => ({
      ...entry,
      value: calculatePercentage(
        entry.value,
        totalWithoutNA === 0 ? entry.total : totalWithoutNA,
      ),
    })),
  );
}

/**
 * Filters out entries with "N/A" labels from chart data
 * @param data - The chart data to filter
 * @returns Filtered chart data without N/A entries
 */
function removeNaLabels(data?: WidgetChartData): WidgetChartData {
  return data?.filter((c) => c.label !== NA_ANSWER_LABEL) || [];
}

/**
 * Calculates percentage and rounds it based on its value:
 * - Below 1, to 2 decimals: a whole number would collapse the value to 0 and
 *   make a real response indistinguishable from missing data
 * - At or above 1, to a whole number
 */
function calculatePercentage(value: number, total: number): number {
  const percentage = (value / total) * 100;

  if (percentage >= 0 && percentage < 1) {
    return Math.round(percentage * 100) / 100;
  }

  return Math.round(percentage);
}

export {
  normalizeWidgetData,
  getResponseRate,
  removeNaLabels,
  getAbsoluteValue,
};
