import { z } from "zod";

export const accountDetailsSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
});
