import { PropsWithChildren } from "react";

import { dehydrate, Hydrate, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";

import {
  DATA_SOURCE_FILTER_NAME,
  DEFAULT_DATA_SOURCE_VALUES,
} from "@/lib/constants";
import { client, QUERY_OPTIONS } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import type { FilterQueryParam } from "@/hooks/use-filters";

import RootLayout from "@/app/(root)/root-layout";

export const metadata: Metadata = {
  title: "Survey analysis | 4Growth",
  description: "Survey analysis | 4Growth",
};

// Mirrors what useFilters sends on a clean survey-analysis load, so the explore
// page and the sidebar section nav both hydrate from this instead of refetching.
const DEFAULT_SECTION_FILTERS: FilterQueryParam[] = [
  {
    name: DATA_SOURCE_FILTER_NAME,
    operator: "=",
    values: [...DEFAULT_DATA_SOURCE_VALUES],
  },
];

export default async function SurveyAnalysisLayout({
  children,
}: PropsWithChildren) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.sections.all(DEFAULT_SECTION_FILTERS).queryKey,
    queryFn: async () =>
      client.sections.getSections.query({
        ...QUERY_OPTIONS,
        query: { filters: DEFAULT_SECTION_FILTERS },
      }),
  });
  await queryClient.prefetchQuery({
    queryKey: queryKeys.pageFilters.all([]).queryKey,
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
