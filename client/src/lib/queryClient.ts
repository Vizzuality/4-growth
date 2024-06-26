import router from "@shared/contracts";
import { initQueryClient } from "@ts-rest/react-query";

import { env } from "@/env";

export const client = initQueryClient(router, {
  validateResponse: true,
  baseUrl: env.NEXT_PUBLIC_API_URL,
});
