import { z } from 'zod';
import {
  VALID_SEARCH_WIDGET_DATA_OPERATORS,
  WidgetDataFilterOperatorType,
} from '@shared/dto/global/search-widget-data-params';

export const SearchWidgetDataFilterSchema = z.object({
  name: z.string(),
  operator: z.enum(
    VALID_SEARCH_WIDGET_DATA_OPERATORS as [WidgetDataFilterOperatorType],
  ),
  values: z.array(z.string()),
});

export const SearchWidgetDataFiltersSchema = z.object({
  filters: z.array(SearchWidgetDataFilterSchema).optional(),
});

export type SearchWidgetDataFiltersSchema = z.infer<
  typeof SearchWidgetDataFiltersSchema
>;

export const SearchWidgetDataParamsSchema = SearchWidgetDataFiltersSchema.merge(
  z.object({ breakdown: z.string().optional() }),
);

export type SearchWidgetDataParamsSchema = z.infer<
  typeof SearchWidgetDataParamsSchema
>;
