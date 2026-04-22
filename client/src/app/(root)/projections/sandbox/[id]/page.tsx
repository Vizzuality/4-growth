import { redirect } from "next/navigation";

import { dehydrate, Hydrate, QueryClient } from "@tanstack/react-query";
import { Session } from "next-auth";

import { client, QUERY_OPTIONS } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import { auth } from "@/app/auth/api/[...nextauth]/config";

import BottomBar from "@/containers/bottom-bar";
import CategorySheet from "@/containers/bottom-bar/category-sheet";
import FeedbackButton from "@/containers/bottom-bar/feedback-button";
import FiltersSheet from "@/containers/bottom-bar/filters-sheet";
import FilterSettings from "@/containers/bottom-bar/projections/filter-settings";
import SettingsSheet from "@/containers/bottom-bar/projections/settings-sheet";
import Sandbox from "@/containers/sandbox/projections-sandbox";
import { PROJECTIONS_DEFAULT_FILTERS } from "@/containers/sidebar/filter-settings/constants";

import { getAuthHeader } from "@/utils/auth-header";
import { getRouteHref } from "@/utils/route-config";

async function fetchSavedProjection(id: string, session: Session | null) {
  try {
    const response =
      await client.savedProjections.findSavedProjection.query({
        params: {
          id: Number(id),
          userId: session?.user?.id as string,
        },
        extraHeaders: {
          ...getAuthHeader(session?.accessToken as string),
        },
        ...QUERY_OPTIONS,
      });

    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function SavedProjectionSandboxPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const session = await auth();

  const response = await fetchSavedProjection(id, session);

  if (response?.status !== 200) {
    if (response?.status === 401) {
      redirect("/auth/signin");
    } else {
      redirect(getRouteHref("projections", "sandbox"));
    }
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.savedProjection(id).queryKey,
    queryFn: async () => response,
  });
  await queryClient.prefetchQuery({
    queryKey: queryKeys.projections.settings().queryKey,
    queryFn: async () =>
      client.projections.getCustomProjectionSettings.query(QUERY_OPTIONS),
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <Sandbox savedProjectionId={id} />
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
