import { QueryClient, dehydrate } from "@tanstack/react-query";
import { Hydrate } from "@tanstack/react-query";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import Profile from "@/containers/profile";

import { auth } from "../auth/api/[...nextauth]/config";

import { getAuthHeader } from "@/utils/auth-header";

export default async function ProfilePage() {
  const queryClient = new QueryClient();
  const session = await auth();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.detail(session?.user?.id as string).queryKey,
    queryFn: () =>
      client.user.findMe.query({
        extraHeaders: {
          ...getAuthHeader(session?.accessToken),
        },
      }),
    // .then((res) => {
    //   if (res.status === 200) return res.body;
    // }),
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <Profile />
    </Hydrate>
  );
}
