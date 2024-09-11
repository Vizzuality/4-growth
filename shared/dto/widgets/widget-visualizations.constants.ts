export const WIDGET_VISUALIZATIONS = {
  SINGLE_VALUE: 'single_value',
  MAP: 'map',
  HORIZONTAL_BAR_CHART: 'horizontal_bar_chart',
  PIE_CHART: 'pie_chart',
  AREA_GRAPH: 'area_graph',
} as const;

export type WidgetVisualizationsType =
  (typeof WIDGET_VISUALIZATIONS)[keyof typeof WIDGET_VISUALIZATIONS];
