import { redirect } from "next/navigation";

import { dehydrate, Hydrate, QueryClient } from "@tanstack/react-query";
import { Session } from "next-auth";

import { client, QUERY_OPTIONS } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import { auth } from "@/app/auth/api/[...nextauth]/config";

import Sandbox from "@/containers/sandbox/user-sandbox";

import { getAuthHeader } from "@/utils/auth-header";

async function fetchCustomWidget(id: string, session: Session | null) {
  try {
    const response = await client.users.findCustomWidget.query({
      params: { id: Number(id), userId: session?.user?.id as string },
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

export default async function SandboxPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const session = await auth();

  const response = await fetchCustomWidget(id, session);

  // TODO: Add proper redirect when API returns correct http codes (in another PR)
  if (response?.status !== 200) {
    redirect("/sandbox");
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.userChart(id).queryKey,
    queryFn: async () => response,
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <Sandbox customWidgetId={id} />
    </Hydrate>
  );
}
