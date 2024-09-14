import { PropsWithChildren } from "react";

import { dehydrate, Hydrate } from "@tanstack/react-query";
import type { Metadata } from "next";

import { client, getQueryClient } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import Sidebar from "@/containers/sidebar";

export const metadata: Metadata = {
  title: "Explore | 4Growth",
  description: "Explore | 4Growth",
};

export default async function ExploreLayout({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.sections.all.queryKey,
    queryFn: () => client.sections.searchSections.query({ query: {} }),
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <div className="grid h-full grid-cols-[280px_1fr] gap-0.5">
        <div className="flex h-full flex-col gap-0.5">
          <Sidebar />
        </div>
        <div className="flex h-full flex-col overflow-hidden">{children}</div>
      </div>
    </Hydrate>
  );
}
