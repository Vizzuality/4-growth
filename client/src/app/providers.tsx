"use client";

import { PropsWithChildren } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { getQueryClient } from "@/lib/queryClient";

const browserQueryClient: QueryClient | undefined = undefined;

export default function LayoutProviders({
  children,
  session,
}: PropsWithChildren<{ session: Session | null }>) {
  const queryClient = getQueryClient(browserQueryClient);

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
