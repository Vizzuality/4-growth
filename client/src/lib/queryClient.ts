import router from "@shared/contracts";
import { QueryClient } from "@tanstack/react-query";
import { initQueryClient } from "@ts-rest/react-query";

import { env } from "@/env";

const client = initQueryClient(router, {
  validateResponse: true,
  baseUrl: env.NEXT_PUBLIC_API_URL,
});

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

function getQueryClient(browserQueryClient?: QueryClient) {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    browserQueryClient = makeQueryClient();
    return browserQueryClient;
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }

    return browserQueryClient;
  }
}

export { client, makeQueryClient, getQueryClient };
