import { z } from 'zod';
import {
  VALID_SEARCH_WIDGET_DATA_OPERATORS,
  WidgetDataFilterOperatorType,
} from '@shared/dto/global/search-widget-data-params';

export const WidgetDataFilterSchema = z.object({
  name: z.string(),
  operator: z.enum(
    VALID_SEARCH_WIDGET_DATA_OPERATORS as [WidgetDataFilterOperatorType],
  ),
  values: z.array(z.string()),
});

export const WidgetDataFiltersSchema = z.object({
  filters: z.array(WidgetDataFilterSchema).optional(),
});

export type WidgetDataFiltersSchema = z.infer<typeof WidgetDataFiltersSchema>;
