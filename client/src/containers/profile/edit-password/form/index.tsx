"use client";

import { FC, useCallback, useRef, useState } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { client } from "@/lib/queryClient";

import { Button } from "@/components/ui/button";
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
import { useToast } from "@/components/ui/use-toast";

import { changePasswordSchema } from "./schema";

import { getAuthHeader } from "@/utils/auth-header";

const SignUpForm: FC = () => {
  const [showPassword, setShowPassword] = useState({
    password: false,
    newPassword: false,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      const formData = Object.fromEntries(data);
      const parsed = changePasswordSchema.safeParse(formData);
      if (parsed.success) {
        try {
          const response = await client.user.updatePassword.mutation({
            body: {
              currentPassword: parsed.data.password,
              newPassword: parsed.data.newPassword,
            },
            extraHeaders: {
              ...getAuthHeader(session?.accessToken as string),
            },
          });

          if (response.status === 200) {
            toast({
              description: "Your password has been updated successfully.",
            });
          }

          if (response.status === 400 || response.status === 401) {
            toast({
              variant: "destructive",
              description: response.body.errors?.[0].title,
            });
          }
        } catch (e) {
          toast({
            variant: "destructive",
            description: "Something went wrong updating the password",
          });
        }
      }
    },
    [session, toast],
  );

  return (
    <Form {...form}>
      <form
        ref={formRef}
        className="w-full space-y-4"
        onSubmit={(evt) => {
          evt.preventDefault();
          form.handleSubmit(() => {
            onSubmit(new FormData(formRef.current!));
          })(evt);
        }}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Input
                    placeholder="Type your current password"
                    type={showPassword[field.name] ? "text" : "password"}
                    autoComplete="current-password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword((prev) => ({
                        ...prev,
                        [field.name]: !prev[field.name],
                      }));
                    }}
                    className="absolute right-20 text-muted-foreground"
                  >
                    {showPassword[field.name] ? (
                      <EyeIcon className="h-4 w-4" strokeWidth={2} />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" strokeWidth={2} />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Input
                    placeholder="Create new password"
                    type={showPassword[field.name] ? "text" : "password"}
                    autoComplete="new-password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword((prev) => ({
                        ...prev,
                        [field.name]: !prev[field.name],
                      }));
                    }}
                    className="absolute right-20 text-muted-foreground"
                  >
                    {showPassword[field.name] ? (
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

        <div className="!mt-10 px-8">
          <Button
            variant="secondary"
            type="submit"
            className="w-full"
            disabled={!form.formState.isValid}
          >
            Apply
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
