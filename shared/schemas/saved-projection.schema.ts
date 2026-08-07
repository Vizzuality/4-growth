import { CustomProjectionSettingsSchema } from '@shared/schemas/custom-projection-settings.schema';
import { SearchFilterSchema } from '@shared/schemas/search-filters.schema';
import { z } from 'zod';

export const CreateSavedProjectionSchema = z.object({
  name: z.string().min(1),
  settings: CustomProjectionSettingsSchema,
  dataFilters: z.array(SearchFilterSchema).optional(),
});

export const UpdateSavedProjectionSchema = z.object({
  name: z.string().min(1).optional(),
  settings: CustomProjectionSettingsSchema.optional(),
  dataFilters: z.array(SearchFilterSchema).optional(),
});
