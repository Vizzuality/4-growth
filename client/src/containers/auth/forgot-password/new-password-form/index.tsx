"use client";

import { FC, FormEvent, useCallback, useRef, useState } from "react";

import { useForm } from "react-hook-form";

import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordSchema } from "@shared/schemas/auth.schemas";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { z } from "zod";

import { client } from "@/lib/queryClient";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useApiResponseToast } from "@/components/ui/use-api-response-toast";

const NewPasswordSchema = z
  .object({
    password: PasswordSchema.shape.password,
    repeatPassword: PasswordSchema.shape.password,
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords must match",
    path: ["repeatPassword"],
  });

const NewPasswordForm: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
  });
  const { apiResponseToast, toast } = useApiResponseToast();
  const router = useRouter();
  const params = useParams<{ token: string }>();

  const handleForgotPassword = useCallback(
    (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

      form.handleSubmit(async (formValues) => {
        try {
          const { status, body } = await client.user.resetPassword.mutation({
            body: formValues,
            extraHeaders: {
              Authorization: `Bearer ${params.token}`,
            },
          });
          apiResponseToast(
            { status, body },
            {
              successMessage: "Password changed successfully.",
            },
          );
          router.push("/auth/signin");
        } catch (err) {
          toast({
            variant: "destructive",
            description: "Something went wrong",
          });
        }
      })(evt);
    },
    [form],
  );

  return (
    <div className="space-y-8 rounded-2xl bg-navy-800 py-6">
      <div className="space-y-4 px-6">
        <h2 className="text-xl font-semibold">Create new password</h2>
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
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <Input
                      placeholder="*******"
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
            name="repeatPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Repeat password</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <Input
                      placeholder="*******"
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
          <div className="space-y-2 px-6">
            <Button variant="secondary" type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewPasswordForm;
