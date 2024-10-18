import { z } from 'zod';

export const CreateCustomWidgetSchema = z.object({
  name: z.string(),
  widgetIndicator: z.string(),
  defaultVisualization: z.string(),
  filters: z.object({}).passthrough(),
});

export const UpdateCustomWidgetSchema = z.object({
  name: z.string().optional(),
  widgetIndicator: z.string().optional(),
  defaultVisualization: z.string().optional(),
  filters: z.object({}).passthrough().optional(),
});
