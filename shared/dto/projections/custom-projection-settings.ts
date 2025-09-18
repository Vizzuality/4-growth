import { SearchFiltersDTO } from '@shared/dto/global/search-filters';
import { PROJECTION_FILTER_NAME_TO_FIELD_NAME } from '@shared/dto/projections/projection-filter.entity';
import { PROJECTION_TYPES } from '@shared/dto/projections/projection-types';
import {
  AVAILABLE_PROJECTION_VISUALIZATIONS,
  PROJECTION_VISUALIZATIONS,
} from '@shared/dto/projections/projection-visualizations.constants';

export const CHART_INDICATORS = Object.values(PROJECTION_TYPES);
export const CHART_ATTRIBUTES = Object.keys(
  PROJECTION_FILTER_NAME_TO_FIELD_NAME,
);

export const CUSTOM_PROJECTION_SETTINGS = {
  availableVisualizations: AVAILABLE_PROJECTION_VISUALIZATIONS,
  [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
    vertical: CHART_INDICATORS,
    color: CHART_ATTRIBUTES,
  },
  [PROJECTION_VISUALIZATIONS.BAR_CHART]: {
    vertical: CHART_INDICATORS,
    color: CHART_ATTRIBUTES,
  },
  [PROJECTION_VISUALIZATIONS.BUBBLE_CHART]: {
    bubble: CHART_ATTRIBUTES,
    vertical: CHART_INDICATORS,
    horizontal: CHART_INDICATORS,
    color: CHART_ATTRIBUTES,
    size: CHART_INDICATORS,
  },
} as const;

export type CustomProjectionSettingsType = {
  availableVisualizations: typeof AVAILABLE_PROJECTION_VISUALIZATIONS;
  [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
    vertical: readonly string[];
    color: readonly string[];
  };
  [PROJECTION_VISUALIZATIONS.BAR_CHART]: {
    vertical: readonly string[];
    color: readonly string[];
  };
  [PROJECTION_VISUALIZATIONS.BUBBLE_CHART]: {
    bubble: readonly string[];
    vertical: readonly string[];
    horizontal: readonly string[];
    color: readonly string[];
    size: readonly string[];
  };
};

// Workaround to be able to generate custom projection settings removing selected indicator to prevent visualizing the same indicator in multiple axes
export const generateCustomProjectionSettings = (
  query: SearchFiltersDTO = {},
) => {
  const { filters } = query;

  if (!filters) return CUSTOM_PROJECTION_SETTINGS;

  const usedValues = filters.reduce((acc, filter) => {
    acc.push(...(filter.values as string[]));
    return acc;
  }, [] as string[]);

  const filteredChartIndicators = CHART_INDICATORS.filter(
    (indicator) => !usedValues.includes(indicator),
  ) as readonly string[];
  const filteredChartAttributes = CHART_ATTRIBUTES.filter(
    (attribute) => !usedValues.includes(attribute),
  ) as readonly string[];

  return {
    availableVisualizations: AVAILABLE_PROJECTION_VISUALIZATIONS,
    [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
      vertical: filteredChartIndicators,
      color: filteredChartAttributes,
    },
    [PROJECTION_VISUALIZATIONS.BAR_CHART]: {
      vertical: filteredChartIndicators,
      color: filteredChartAttributes,
    },
    [PROJECTION_VISUALIZATIONS.BUBBLE_CHART]: {
      bubble: filteredChartAttributes,
      vertical: filteredChartIndicators,
      horizontal: filteredChartIndicators,
      color: filteredChartAttributes,
      size: filteredChartIndicators,
    },
  } as CustomProjectionSettingsType;
};
