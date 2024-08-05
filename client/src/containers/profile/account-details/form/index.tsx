"use client";

import { FC, KeyboardEvent, useCallback, useRef, useState } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { SquarePenIcon, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { accountDetailsSchema } from "./schema";

import { getAuthHeader } from "@/utils/auth-header";

const AccountDetailsForm: FC = () => {
  const queryClient = useQueryClient();
  const { data: session, update: updateSession } = useSession();
  const [isEditing, setEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const { data: user } = client.user.findMe.useQuery(
    queryKeys.users.detail(session?.user?.id as string).queryKey,
    {
      extraHeaders: {
        ...getAuthHeader(session?.accessToken as string),
      },
      query: {},
    },
    {
      select: (data) => data.body.data,
    },
  );

  const form = useForm<z.infer<typeof accountDetailsSchema>>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: {
      email: user?.email,
    },
    mode: "onSubmit",
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      const formData = Object.fromEntries(data);
      const parsed = accountDetailsSchema.safeParse(formData);

      if (parsed.success) {
        const response = await client.user.updateUser.mutation({
          params: {
            id: session?.user?.id as string,
          },
          body: {
            email: parsed.data.email,
          },
          extraHeaders: {
            ...getAuthHeader(session?.accessToken as string),
          },
        });

        if (response.status === 200) {
          updateSession(response.body);

          queryClient.invalidateQueries(
            queryKeys.users.detail(response.body.data.id).queryKey,
          );

          toast({
            description: "Your email has been updated successfully.",
          });
        }
      }
    },
    [queryClient, session, updateSession, toast],
  );

  const handleEnterKey = useCallback(
    (evt: KeyboardEvent) => {
      if (evt.code === "Enter" && isEditing && form.formState.isValid) {
        form.handleSubmit(() => {
          onSubmit(new FormData(formRef.current!));
        })();
      }
    },
    [isEditing, form, onSubmit],
  );

  return (
    <Form {...form}>
      <form
        ref={formRef}
        className="w-full space-y-4"
        onSubmit={(evt) => {
          form.handleSubmit(() => {
            onSubmit(new FormData(formRef.current!));
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
                <div className="relative flex items-center">
                  <Input
                    type="email"
                    autoComplete={field.name}
                    readOnly={!isEditing}
                    onKeyDown={handleEnterKey}
                    {...field}
                    onBlur={() => {
                      field.onBlur();
                      setEditing(false);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEditing((prev) => !prev);
                      form.setFocus("email");
                    }}
                    className="absolute right-20 text-muted-foreground"
                  >
                    {isEditing ? (
                      <XIcon className="h-4 w-4" />
                    ) : (
                      <SquarePenIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default AccountDetailsForm;
