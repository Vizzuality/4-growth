import { z } from 'zod';
import {
  SearchFilterOperatorType,
  VALID_SEARCH_FILTER_OPERATORS,
} from '@shared/dto/global/search-filters';

export const SearchFilterSchema = z.object({
  name: z.string(),
  operator: z.enum(VALID_SEARCH_FILTER_OPERATORS as [SearchFilterOperatorType]),
  values: z.array(z.string()),
});

export const SearchFiltersSchema = z.object({
  filters: z.array(SearchFilterSchema).optional(),
  // Data filter is used to filter data of entities than can be searched but also need search params for nested data
  // like projections
  // Eg: Projection widgets can be filteres using ?filters but innerData use ?dataFilters
  dataFilters: z.array(SearchFilterSchema).optional(),
});
