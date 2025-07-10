import { PROJECTION_FILTER_NAME_TO_FIELD_NAME } from '@shared/dto/projections/projection-filter.entity';
import { PROJECTION_TYPES } from '@shared/dto/projections/projection-types';
import {
  AVAILABLE_PROJECTION_VISUALIZATIONS,
  PROJECTION_VISUALIZATIONS,
} from '@shared/dto/projections/projection-visualizations.constants';

export const BUBBLE_CHART_INDICATORS = Object.values(PROJECTION_TYPES);
export const BUBBLE_CHART_ATTRIBUTES = Object.keys(
  PROJECTION_FILTER_NAME_TO_FIELD_NAME,
);

export const CUSTOM_PROJECTION_SETTINGS = {
  availableVisualizations: AVAILABLE_PROJECTION_VISUALIZATIONS,
  [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
    vertical: BUBBLE_CHART_INDICATORS,
  },
  [PROJECTION_VISUALIZATIONS.BAR_CHART]: {
    vertical: BUBBLE_CHART_INDICATORS,
  },
  [PROJECTION_VISUALIZATIONS.AREA_CHART]: {
    vertical: BUBBLE_CHART_INDICATORS,
  },
  [PROJECTION_VISUALIZATIONS.BUBBLE_CHART]: {
    bubble: BUBBLE_CHART_ATTRIBUTES,
    vertical: BUBBLE_CHART_INDICATORS,
    horizontal: BUBBLE_CHART_INDICATORS,
    color: BUBBLE_CHART_ATTRIBUTES,
    size: BUBBLE_CHART_INDICATORS,
  },
} as const;

export type CustomProjectionSettingsType = typeof CUSTOM_PROJECTION_SETTINGS;
