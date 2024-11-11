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
 * Calculates percentage values for chart data using individual totals
 */
function normalizeChartData(chartData: WidgetChartData): WidgetChartData {
  return chartData.map((entry) => ({
    ...entry,
    value: calculatePercentage(entry.value, entry.total),
  }));
}

/**
 * Calculates percentage and rounds to nearest integer
 */
function calculatePercentage(value: number, total: number): number {
  return Math.round((value / total) * 100);
}

export { normalizeWidgetData };
