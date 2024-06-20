import { z } from "zod";

export const signUpSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  privacyPolicy: z.boolean().refine((value) => value === true, {
    message: "Privacy policy must be accepted",
  }),
});
