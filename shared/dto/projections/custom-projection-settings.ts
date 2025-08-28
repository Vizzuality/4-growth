import { PROJECTION_FILTER_NAME_TO_FIELD_NAME } from '@shared/dto/projections/projection-filter.entity';
import {
  PROJECTION_TYPES,
  ProjectionScenarios,
} from '@shared/dto/projections/projection-types';
import {
  AVAILABLE_PROJECTION_VISUALIZATIONS,
  PROJECTION_VISUALIZATIONS,
} from '@shared/dto/projections/projection-visualizations.constants';

export const CHART_INDICATORS = Object.values(PROJECTION_TYPES);
export const CHART_ATTRIBUTES = Object.keys(
  PROJECTION_FILTER_NAME_TO_FIELD_NAME,
);
export const CHART_SCENARIOS = Object.values(ProjectionScenarios);

const SIMPLE_CHART_COLOR = [
  ...CHART_INDICATORS,
  ...CHART_ATTRIBUTES,
  ...CHART_SCENARIOS,
];

export const CUSTOM_PROJECTION_SETTINGS = {
  availableVisualizations: AVAILABLE_PROJECTION_VISUALIZATIONS,
  [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
    vertical: CHART_INDICATORS,
    color: SIMPLE_CHART_COLOR,
  },
  [PROJECTION_VISUALIZATIONS.BAR_CHART]: {
    vertical: CHART_INDICATORS,
    color: SIMPLE_CHART_COLOR,
  },
  [PROJECTION_VISUALIZATIONS.BUBBLE_CHART]: {
    bubble: CHART_ATTRIBUTES,
    vertical: CHART_INDICATORS,
    horizontal: CHART_INDICATORS,
    color: CHART_ATTRIBUTES,
    size: CHART_INDICATORS,
  },
} as const;

export type CustomProjectionSettingsType = typeof CUSTOM_PROJECTION_SETTINGS;
