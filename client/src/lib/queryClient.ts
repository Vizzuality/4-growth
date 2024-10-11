import router from "@shared/contracts";
import { QueryClient } from "@tanstack/react-query";
import { initQueryClient } from "@ts-rest/react-query";

import { env } from "@/env";

const client = initQueryClient(router, {
  validateResponse: true,
  baseUrl: env.NEXT_PUBLIC_API_URL,
});

const QUERY_OPTIONS = {
  fetchOptions: { cache: "no-cache" },
} as const;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export { client, QUERY_OPTIONS, makeQueryClient };
