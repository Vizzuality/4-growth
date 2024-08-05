"use client";

import { FC, useEffect, useRef, useState } from "react";

import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { SignUpSchema } from "@shared/schemas/auth.schemas";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { signUpAction } from "./action";

export const PrivacyPolicySchema = z.object({
  privacyPolicy: z.boolean().refine((value) => value === true, {
    message: "Privacy policy must be accepted",
  }),
});

export const SignUpWithPrivacyPolicySchema = z.intersection(
  SignUpSchema,
  PrivacyPolicySchema,
);

const SignUpForm: FC = () => {
  const { push } = useRouter();
  const [status, formAction] = useFormState(signUpAction, {
    ok: undefined,
    message: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof SignUpWithPrivacyPolicySchema>>({
    resolver: zodResolver(SignUpWithPrivacyPolicySchema),
    defaultValues: {
      email: "",
      password: "",
      privacyPolicy: false,
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (status.ok) {
      push("/auth/signin");
    }
  }, [status, push]);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        className="w-full space-y-4"
        onSubmit={(evt) => {
          evt.preventDefault();
          form.handleSubmit(() => {
            formAction(new FormData(formRef.current!));
          })(evt);
        }}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Input
                    placeholder="Create a password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword((prev) => !prev);
                    }}
                    className="absolute right-20 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeIcon className="h-4 w-4" strokeWidth={2} />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" strokeWidth={2} />
                    )}
                  </button>
                </div>
              </FormControl>
              {!fieldState.invalid && (
                <FormDescription>
                  Password must contain at least 8 characters.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="privacyPolicy"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center space-x-2 px-8">
                  <Checkbox
                    {...field}
                    id={field.name}
                    value="privacyPolicy"
                    onCheckedChange={field.onChange}
                  />
                  <Label
                    htmlFor={field.name}
                    className="text-xs text-muted-foreground"
                  >
                    I agree with 4Growth&apos;s{" "}
                    <Link
                      href="/privacy-policy"
                      className="underline underline-offset-[3px]"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </Label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="!mt-10 px-8">
          <Button variant="secondary" type="submit" className="w-full">
            Sign up
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
