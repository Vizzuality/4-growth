import { PropsWithChildren } from "react";

import { dehydrate, Hydrate, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";

import { client, QUERY_OPTIONS } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import Overlay from "@/containers/overlay";
import Sidebar from "@/containers/sidebar";

export const metadata: Metadata = {
  title: "Explore | 4Growth",
  description: "Explore | 4Growth",
};

export default async function ExploreLayout({ children }: PropsWithChildren) {
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
      <Overlay />
      <div className="grid h-full grid-cols-[280px_1fr] gap-0.5">
        <div className="flex h-full flex-col gap-0.5 overflow-hidden">
          <Sidebar />
        </div>
        <div className="flex h-full flex-col overflow-hidden">{children}</div>
      </div>
    </Hydrate>
  );
}
