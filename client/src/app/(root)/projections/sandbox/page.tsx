import { dehydrate, Hydrate, QueryClient } from "@tanstack/react-query";

import { client, QUERY_OPTIONS } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import BottomBar from "@/containers/bottom-bar";
import CategorySheet from "@/containers/bottom-bar/category-sheet";
import FeedbackButton from "@/containers/bottom-bar/feedback-button";
import FiltersSheet from "@/containers/bottom-bar/filters-sheet";
import FilterSettings from "@/containers/bottom-bar/projections/filter-settings";
import SettingsSheet from "@/containers/bottom-bar/projections/settings-sheet";
import Sandbox from "@/containers/sandbox/projections-sandbox";
import { PROJECTIONS_DEFAULT_FILTERS } from "@/containers/sidebar/filter-settings/constants";

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
        <CategorySheet />
        <SettingsSheet />
        <FiltersSheet>
          <FilterSettings defaultFilters={PROJECTIONS_DEFAULT_FILTERS} />
        </FiltersSheet>
        <FeedbackButton />
      </BottomBar>
    </Hydrate>
  );
}
