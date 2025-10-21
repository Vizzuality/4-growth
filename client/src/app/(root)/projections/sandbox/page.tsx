import { dehydrate, Hydrate, QueryClient } from "@tanstack/react-query";

import { client, QUERY_OPTIONS } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import BottomBar from "@/containers/bottom-bar";
import FiltersSheet from "@/containers/bottom-bar/projections/filters-sheet";
import SettingsSheet from "@/containers/bottom-bar/projections/settings-sheet";
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
      <BottomBar>
        <SettingsSheet />
        <FiltersSheet />
      </BottomBar>
    </Hydrate>
  );
}
