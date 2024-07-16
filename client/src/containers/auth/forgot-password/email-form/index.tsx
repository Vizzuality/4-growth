"use client";

import { FC, FormEvent, useCallback, useRef } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
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

// todo: use shared schema when https://github.com/Vizzuality/4-growth/pull/60 is merged
const ForgotPasswordSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
});

const ForgotPasswordEmailForm: FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotPassword = useCallback(
    (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

      form.handleSubmit(async (formValues) => {
        try {
          console.log(formValues);
          // todo: connect with API. If success, show a toast asking the user to check their inbox.
        } catch (err) {
          // todo: error handling. Show toast with a explicit error message here. The user will read this.
        }
      })(evt);
    },
    [form],
  );

  return (
    <div className="space-y-8 rounded-2xl bg-navy-800 py-6">
      <div className="space-y-4 px-6">
        <h2 className="text-xl font-semibold">Reset your password</h2>
        <p className="text-xs text-muted-foreground">
          Enter your email address, and we&apos;ll send you a link to get back
          into your account.
        </p>
      </div>
      <Form {...form}>
        <form
          ref={formRef}
          className="w-full space-y-8"
          onSubmit={handleForgotPassword}
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
          <div className="space-y-2 px-6">
            <Button variant="secondary" type="submit" className="w-full">
              Send link
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordEmailForm;
