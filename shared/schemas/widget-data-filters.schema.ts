import { z } from 'zod';
import {
  VALID_SEARCH_WIDGET_DATA_OPERATORS,
  WidgetDataFilterOperatorType,
} from '@shared/dto/global/search-widget-data-params';

export const WidgetDataFiltersSchema = z.object({
  filters: z
    .array(
      z.object({
        name: z.string(),
        operator: z.enum(
          VALID_SEARCH_WIDGET_DATA_OPERATORS as [WidgetDataFilterOperatorType],
        ),
        value: z.unknown(),
      }),
    )
    .optional(),
});

export type WidgetDataFiltersType = z.infer<typeof WidgetDataFiltersSchema>;
