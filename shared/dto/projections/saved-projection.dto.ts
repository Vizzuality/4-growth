import {
  CreateSavedProjectionSchema,
  UpdateSavedProjectionSchema,
} from '@shared/schemas/saved-projection.schema';
import { z } from 'zod';

export type CreateSavedProjectionDTO = z.infer<
  typeof CreateSavedProjectionSchema
>;
export type UpdateSavedProjectionDTO = z.infer<
  typeof UpdateSavedProjectionSchema
>;
