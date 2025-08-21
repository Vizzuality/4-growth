export const PROJECTION_VISUALIZATIONS = {
  LINE_CHART: 'line_chart',
  BAR_CHART: 'bar_chart',
  BUBBLE_CHART: 'bubble_chart',
  TABLE: 'table',
} as const;

export const AVAILABLE_PROJECTION_VISUALIZATIONS = Object.values(
  PROJECTION_VISUALIZATIONS,
).filter((value) => value !== PROJECTION_VISUALIZATIONS.TABLE);

export type ProjectionVisualizationsType =
  (typeof PROJECTION_VISUALIZATIONS)[keyof typeof PROJECTION_VISUALIZATIONS];

export const PROJECTION_2D_VISUALIZATIONS = {
  LINE_CHART: 'line_chart',
  BAR_CHART: 'bar_chart',
  TABLE: 'table',
} as const;

export const AVAILABLE_PROJECTION_2D_VISUALIZATIONS = Object.values(
  PROJECTION_2D_VISUALIZATIONS,
);

export type Projection2DVisualizationsType =
  (typeof PROJECTION_2D_VISUALIZATIONS)[keyof typeof PROJECTION_2D_VISUALIZATIONS];
