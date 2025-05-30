export const PROJECTION_VISUALIZATIONS = {
  LINE_CHART: 'line_chart',
  AREA_CHART: 'area_chart',
  BAR_CHART: 'bar_chart',
  BUBBLE_CHART: 'bubble_chart',
} as const;

export const AVIALABLE_PROJECTION_VISUALIZATIONS = Object.values(
  PROJECTION_VISUALIZATIONS,
);

export type ProjectionVisualizationsType =
  (typeof PROJECTION_VISUALIZATIONS)[keyof typeof PROJECTION_VISUALIZATIONS];
