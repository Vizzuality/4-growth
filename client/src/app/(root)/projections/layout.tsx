import { PropsWithChildren } from "react";

import { dehydrate, Hydrate, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";

import { client, QUERY_OPTIONS } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import RootLayout from "@/app/(root)/root-layout";

export const metadata: Metadata = {
  title: "Projections | 4Growth",
  description: "Projections | 4Growth",
};

export default async function ProjectionsLayout({
  children,
}: PropsWithChildren) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.projections.widgets([]).queryKey,
    queryFn: async () =>
      client.projections.getProjectionsWidgets.query(QUERY_OPTIONS),
  });
  await queryClient.prefetchQuery({
    queryKey: queryKeys.projections.filters.queryKey,
    queryFn: async () =>
      client.projections.getProjectionsFilters.query(QUERY_OPTIONS),
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <RootLayout>{children}</RootLayout>
    </Hydrate>
  );
}
