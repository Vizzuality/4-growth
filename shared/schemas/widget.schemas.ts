import { z } from 'zod';

export const CreateCustomWidgetSchema = z.object({
  name: z.string(),
  widgetId: z.number(),
  defaultVisualization: z.string(),
  filters: z.object({}).passthrough(),
});

export const UpdateCustomWidgetSchema = z.object({
  name: z.string().optional(),
  widgetId: z.number(),
  defaultVisualization: z.string(),
  filters: z.object({}).passthrough(),
});
