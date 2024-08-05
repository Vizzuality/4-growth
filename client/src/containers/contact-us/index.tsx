"use client";

import { FC, FormEvent, useCallback, useRef, useState } from "react";

import { useForm } from "react-hook-form";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { ContactUsSchema } from "@shared/schemas/contact.schema";
import { z } from "zod";

import { client } from "@/lib/queryClient";

import { PrivacyPolicySchema } from "@/containers/auth/signup/form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApiResponseToast } from "@/components/ui/use-api-response-toast";

export const ContactUsWithPrivacyPolicySchema =
  ContactUsSchema.merge(PrivacyPolicySchema);

const ContactUsForm: FC = () => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { apiResponseToast, toast } = useApiResponseToast();
  const form = useForm<z.infer<typeof ContactUsWithPrivacyPolicySchema>>({
    resolver: zodResolver(ContactUsWithPrivacyPolicySchema),
    // why omit privacyPolicy? The schema was instantiated with it.
    defaultValues: {
      name: "",
      email: "",
      message: "",
      privacyPolicy: false,
    },
    mode: "onSubmit",
  });

  const handleContactUs = useCallback(
    (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

      form.handleSubmit(async (formValues) => {
        setIsSending(true);
        const { name, email, message } = formValues;
        try {
          const { status, body } = await client.contact.contact.mutation({
            body: { name, email, message },
          });
          apiResponseToast(
            { status, body },
            { successMessage: "Message sent!" },
          );
        } catch (err) {
          toast({
            variant: "destructive",
            description: "Something went wrong",
          });
        } finally {
          setIsSending(false);
          form.reset();
        }
      })(evt);
    },
    [form],
  );

  return (
    <div className="relative space-y-8 rounded-2xl bg-transparent py-6 before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-2xl before:bg-navy-900/50 before:backdrop-blur">
      <div className="relative px-6">
        <h2 className="text-xl font-semibold">Contact</h2>
      </div>
      <Form {...form}>
        <form
          ref={formRef}
          className="relative z-10 w-full space-y-8"
          onSubmit={handleContactUs}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    type="text"
                    autoFocus
                    autoComplete="name"
                    {...field}
                  />
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
                  <Input autoFocus placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-[425px]"
                    placeholder="Enter your message here"
                    {...field}
                  />
                </FormControl>
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
                        className="text-foreground underline underline-offset-[3px]"
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
          <div className="space-y-2 px-6">
            <Button variant="secondary" type="submit" className="w-full">
              {isSending ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ContactUsForm;
