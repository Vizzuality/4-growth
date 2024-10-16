import { z } from 'zod';
import {
  VALID_WIDGET_VISUALIZATIONS,
  WidgetVisualizationsType,
} from '@shared/dto/widgets/widget-visualizations.constants';

export const WidgetVisualizationFilterSchema = z.object({
  visualisations: z.array(
    z.enum(VALID_WIDGET_VISUALIZATIONS as [WidgetVisualizationsType]),
  ),
});

export type WidgetVisualisationFilters = z.infer<
  typeof WidgetVisualizationFilterSchema
>;
