"use server";
import { SignUpSchema } from "@shared/schemas/auth.schemas";
import { z } from "zod";

import { client } from "@/lib/queryClient";

export type FormState = {
  ok: boolean | undefined;
  message: string | string[] | undefined;
};

const PrivacyPolicy = z.object({
  privacyPolicy: z.boolean().refine((value) => value === true, {
    message: "Privacy policy must be accepted",
  }),
});

export async function signUpAction(
  prevState: FormState,
  data: FormData,
): Promise<FormState> {
  const mergedSchema = SignUpSchema.merge(PrivacyPolicy);
  const formData = Object.fromEntries(data);
  const parsed = mergedSchema.omit({ privacyPolicy: true }).safeParse(formData);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid form data",
    };
  }

  try {
    const response = await client.auth.signUp.mutation({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
    });

    if (response.status === 400) {
      return {
        ok: false,
        message:
          response.body.errors?.map(({ title }) => title) ?? "unknown error",
      };
    }

    if (response.status === 409) {
      return {
        ok: false,
        message:
          response.body.errors?.map(({ title }) => title) ?? "unknown error",
      };
    }
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  }

  return {
    ok: true,
    message: "",
  };
}
