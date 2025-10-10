import { useEffect } from "react";

import { usePathname } from "next/navigation";

import { signOut, useSession } from "next-auth/react";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { isPrivatePath } from "@/lib/utils";

import { getAuthHeader } from "@/utils/auth-header";

/**
 * This should be a temporary solution to check if the access token is expired.
 * next-auth currently does not support server-side signout.
 * More info https://github.com/nextauthjs/next-auth/discussions/5334
 * TODO: A better solution would be to use a middleware to check if the access token is expired!
 */
export default function SessionChecker() {
  const { data: session } = useSession();
  const queryKey = queryKeys.users.detail(session?.user?.id as string).queryKey;

  const pathname = usePathname();
  const queryEnabled = isPrivatePath(pathname);
  const { data, isFetched } = client.users.findMe.useQuery(
    queryKey,
    {
      query: {},
      extraHeaders: {
        ...getAuthHeader(session?.accessToken),
      },
    },
    {
      queryKey,
      enabled: queryEnabled,
      retry: false,
    },
  );

  useEffect(() => {
    if (!queryEnabled || !isFetched) return;
    if (data?.status !== 200) {
      signOut({
        redirect: queryEnabled,
        callbackUrl: queryEnabled ? "/auth/signin" : undefined,
      });
    }
  }, [isFetched, data, queryEnabled]);

  return null;
}
