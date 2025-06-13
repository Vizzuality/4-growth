import { PropsWithChildren } from "react";

import { dehydrate, Hydrate, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";

import { client, QUERY_OPTIONS } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import RootLayout from "@/app/(root)/root-layout";

export const metadata: Metadata = {
  title: "Survey analysis | 4Growth",
  description: "Survey analysis | 4Growth",
};

export default async function SurveyAnalysisLayout({
  children,
}: PropsWithChildren) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.sections.all([]).queryKey,
    queryFn: async () => client.sections.getSections.query(QUERY_OPTIONS),
  });
  await queryClient.prefetchQuery({
    queryKey: queryKeys.pageFilters.all.queryKey,
    queryFn: async () => client.pageFilter.searchFilters.query(QUERY_OPTIONS),
  });
  await queryClient.prefetchQuery({
    queryKey: queryKeys.widgets.all.queryKey,
    queryFn: async () => client.widgets.getWidgets.query(QUERY_OPTIONS),
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <RootLayout>{children}</RootLayout>
    </Hydrate>
  );
}
