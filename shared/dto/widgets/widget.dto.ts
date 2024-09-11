import {
  CreateCustomWidgetSchema,
  UpdateCustomWidgetSchema,
} from '@shared/schemas/widget.schemas';
import { z } from 'zod';

export type CreateCustomWidgetDTO = z.infer<typeof CreateCustomWidgetSchema>;
export type UpdateCustomWidgetDTO = z.infer<typeof UpdateCustomWidgetSchema>;
