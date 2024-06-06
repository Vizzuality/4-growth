"use client";

import { FC, FormEvent, useCallback, useRef, useState } from "react";

import { useForm } from "react-hook-form";

import { useSearchParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { signInSchema } from "./schema";

const SignInForm: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = useCallback(
    (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      form.handleSubmit(async (formValues) => {
        try {
          const response = await signIn("credentials", {
            ...formValues,
            redirect: false,
          });

          if (response?.ok) {
            router.push(searchParams.get("callbackUrl") ?? "/profile");
          }

          if (!response?.ok) {
            setErrorMessage(response?.error ?? "unknown error");
          }
        } catch (err) {
          if (err instanceof Error) {
            setErrorMessage(err.message ?? "unknown error");
          }
        }
      })(evt);
    },
    [form, router, searchParams],
  );

  return (
    <>
      {errorMessage && <div>{errorMessage}</div>}
      <Form {...form}>
        <form
          ref={formRef}
          className="space-y-8 w-[375px]"
          onSubmit={handleSignIn}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="lorem@ipsum.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="*******"
                    type="password"
                    autoComplete={field.name}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
};

export default SignInForm;
