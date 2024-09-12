import { dehydrate, Hydrate, QueryClient } from "@tanstack/react-query";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import Explore from "@/containers/explore";

export default async function ExplorePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.sections.all.queryKey,
    queryFn: () => client.sections.searchSections.query({ query: {} }),
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <Explore />
    </Hydrate>
  );
}
