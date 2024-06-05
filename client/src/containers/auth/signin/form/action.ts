"use server";

import { redirect } from "next/navigation";

import { AuthError } from "next-auth";

import { signInSchema } from "./schema";

import { signIn } from "@/auth";

export type FormState = {
  message: string | string[] | undefined;
};

export async function signInAction(
  prevState: FormState,
  data: FormData,
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = signInSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: "Invalid form data",
    };
  }

  let signInSuccess = false;

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirect: false,
    });
    signInSuccess = true;
  } catch (error: Error | unknown) {
    if (error instanceof AuthError) {
      return {
        message: error.cause?.err?.message,
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message,
      };
    }
  } finally {
    if (signInSuccess) redirect("/profile");
  }

  return {
    message: "unknown error",
  };
}
