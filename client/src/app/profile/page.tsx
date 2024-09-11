import { QueryClient, dehydrate } from "@tanstack/react-query";
import { Hydrate } from "@tanstack/react-query";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import Profile from "@/containers/profile";

import { getAuthHeader } from "@/utils/auth-header";

import { auth } from "../auth/api/[...nextauth]/config";

export default async function ProfilePage() {
  const queryClient = new QueryClient();
  const session = await auth();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.detail(session?.user?.id as string).queryKey,
    queryFn: () =>
      client.users.findMe.query({
        extraHeaders: {
          ...getAuthHeader(session?.accessToken),
        },
        // Pending to add FetchSpecification as zod schema in the contract
        query: {},
      }),
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <Profile />
    </Hydrate>
  );
}
