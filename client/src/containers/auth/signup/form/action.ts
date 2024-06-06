"use server";

import { client } from "@/lib/queryClient";

import { signUpSchema } from "./schema";

export type FormState = {
  message: string | string[] | undefined;
};

export async function signUpAction(
  prevState: FormState,
  data: FormData,
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = signUpSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: "Invalid form data",
    };
  }

  try {
    const response = await client.auth.signUp.mutation({
      body: {
        username: parsed.data.username,
        email: parsed.data.email,
        password: parsed.data.password,
      },
    });

    if (response.status === 400) {
      return {
        message:
          response.body.errors?.map(({ title }) => title) ?? "unknown error",
      };
    }

    if (response.status === 409) {
      return {
        message:
          response.body.errors?.map(({ title }) => title) ?? "unknown error",
      };
    }
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      return {
        message: error.message,
      };
    }
  }

  return {
    message: "Unknown error",
  };
}
