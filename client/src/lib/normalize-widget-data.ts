import {
  WidgetChartData,
  WidgetData,
  WidgetMapData,
} from "@shared/dto/widgets/base-widget-data.interface";

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
    result.breakdown = result.breakdown.map((b) => ({
      ...b,
      data: normalizeChartData(b.data),
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
    (acc, curr) => (curr.label !== "N/A" ? acc + curr.value : acc),
    0,
  );
}

/**
 * Calculates percentage values for chart data using the total value
 * without N/A, plus filters out N/A from the array
 */
function normalizeChartData(chartData: WidgetChartData): WidgetChartData {
  const totalWithoutNA = calculateTotalWithoutNA(chartData);

  return chartData
    .map((entry) => ({
      ...entry,
      value: calculatePercentage(
        entry.value,
        totalWithoutNA === 0 ? entry.total : totalWithoutNA,
      ),
    }))
    .filter((c) => c.label !== "N/A");
}

/**
 * Calculates percentage and rounds to nearest integer
 */
function calculatePercentage(value: number, total: number): number {
  return Math.round((value / total) * 100);
}

export { normalizeWidgetData, getResponseRate };
