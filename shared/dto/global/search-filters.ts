import { z } from 'zod';
import {
  SearchFilterSchema,
  SearchFiltersSchema,
} from '@shared/schemas/search-filters.schema';

export const SEARCH_FILTERS_OPERATORS = {
  EQUALS: '=',
  NOT_EQUALS: '!=',
  IN: 'IN',
  NOT_IN: '!IN',
} as const;

export const VALID_SEARCH_FILTER_OPERATORS = Object.values(
  SEARCH_FILTERS_OPERATORS,
);

export type SearchFilterOperatorType =
  (typeof SEARCH_FILTERS_OPERATORS)[keyof typeof SEARCH_FILTERS_OPERATORS];

export type SearchFilterDTO = z.infer<typeof SearchFilterSchema>;
export type SearchFiltersDTO = z.infer<typeof SearchFiltersSchema>;
