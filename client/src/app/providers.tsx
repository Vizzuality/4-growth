"use client";

import { PropsWithChildren } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { getQueryClient } from "@/lib/queryClient";

export default function LayoutProviders({
  children,
  session,
}: PropsWithChildren<{ session: Session | null }>) {
  const queryClient = getQueryClient();

  return (
    <>
      <SessionProvider session={session} basePath="/auth/api">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}
