import router from "@shared/contracts";
import { initQueryClient } from "@ts-rest/react-query";

export const client = initQueryClient(router, {
  validateResponse: true,
  // todo: type env vars
  baseUrl: process.env.NEXT_PUBLIC_API_URL as string,
});
