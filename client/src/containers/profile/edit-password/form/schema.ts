import { z } from "zod";

const passwordSchema = z
  .string({ message: "Password is required" })
  .min(1, "Password is required")
  .min(8, "Password must be more than 8 characters")
  .max(32, "Password must be less than 32 characters");

export const changePasswordSchema = z.object({
  password: passwordSchema,
  newPassword: passwordSchema,
});
