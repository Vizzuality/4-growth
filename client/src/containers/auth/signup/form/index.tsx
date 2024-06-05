"use client";

import { FC, useRef } from "react";

import { useFormState } from "react-dom";
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

import { signUpAction } from "./action";
import { signUpSchema } from "./schema";

const SignUpForm: FC = () => {
  const [state, formAction] = useFormState(signUpAction, {
    message: "",
  });
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  return (
    <>
      {Array.isArray(state?.message) && (
        <>
          {state.message.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </>
      )}
      {!Array.isArray(state?.message) && <div>{state?.message}</div>}
      <Form {...form}>
        <form
          ref={formRef}
          action={formAction}
          className="space-y-8 w-[375px]"
          onSubmit={(evt) => {
            evt.preventDefault();
            form.handleSubmit(() => {
              formAction(new FormData(formRef.current!));
            })(evt);
          }}
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="lorem ipsum" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

export default SignUpForm;
