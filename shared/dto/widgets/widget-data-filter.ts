import { WidgetDataFilterSchema } from '@shared/schemas/widget-data-filters.schema';
import { z } from 'zod';

export type WidgetDataFilter = z.infer<typeof WidgetDataFilterSchema>;
export type WidgetDataFilters = WidgetDataFilter[];
