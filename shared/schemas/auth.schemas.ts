import { z } from 'zod';

export const SignInSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: z
    .string({ message: 'Password is required' })
    .min(1, 'Password is required')
    .min(8, 'Password must contain at least 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});

export const SignUpSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: z
    .string({ message: 'Password is required' })
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  // TODO: Check with FE how to handle this, the contract does not need to know about this
  // privacyPolicy: z.boolean().refine((value) => value === true, {
  //   message: 'Privacy policy must be accepted',
  // }),
});
