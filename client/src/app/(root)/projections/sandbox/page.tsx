import { dehydrate, Hydrate, QueryClient } from "@tanstack/react-query";

import { client, QUERY_OPTIONS } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import Sandbox from "@/containers/sandbox/projections-sandbox";

export default async function ProjectionsSandboxPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.projections.settings.queryKey,
    queryFn: async () =>
      client.projections.getCustomProjectionSettings.query(QUERY_OPTIONS),
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <Sandbox />
    </Hydrate>
  );
}
