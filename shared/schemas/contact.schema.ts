import { z } from 'zod';
import { EmailSchema } from '@shared/schemas/auth.schemas';

export const ContactUsSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(2, 'Name must contain at least 2 characters'),
  email: EmailSchema.shape.email,
  message: z
    .string({ message: 'Message is required' })
    .min(2, 'Message is required'),
});
