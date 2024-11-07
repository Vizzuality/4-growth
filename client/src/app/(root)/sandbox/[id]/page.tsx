import { dehydrate, Hydrate, QueryClient } from "@tanstack/react-query";

import { client, QUERY_OPTIONS } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import { auth } from "@/app/auth/api/[...nextauth]/config";

import UserSandbox from "@/containers/sandbox/user-sandbox";

import { getAuthHeader } from "@/utils/auth-header";

export default async function SandboxPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const queryClient = new QueryClient();
  const session = await auth();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.userChart(id).queryKey,
    queryFn: async () =>
      client.users.findCustomWidget.query({
        params: { id, userId: session?.user?.id as string },
        extraHeaders: {
          ...getAuthHeader(session?.accessToken as string),
        },
        ...QUERY_OPTIONS,
      }),
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <UserSandbox customWidgetId={id} />
    </Hydrate>
  );
}
