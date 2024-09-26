export const SEARCH_WIDGET_DATA_OPERATORS = {
  EQUALS: '=',
  NOT_EQUALS: '!=',
} as const;

export const VALID_SEARCH_WIDGET_DATA_OPERATORS = Object.values(
  SEARCH_WIDGET_DATA_OPERATORS,
);

export type WidgetDataFilterOperatorType =
  (typeof SEARCH_WIDGET_DATA_OPERATORS)[keyof typeof SEARCH_WIDGET_DATA_OPERATORS];
