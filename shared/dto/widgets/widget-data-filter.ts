import { SearchWidgetDataFilterSchema } from '@shared/schemas/search-widget-data-params.schema';
import { z } from 'zod';

export type WidgetDataFilter = z.infer<typeof SearchWidgetDataFilterSchema>;
