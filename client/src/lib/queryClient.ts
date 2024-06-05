import router from "@shared/contracts";
import { initQueryClient } from "@ts-rest/react-query";
// import axios, { Method, AxiosResponse, isAxiosError } from "axios";

export const client = initQueryClient(router, {
  validateResponse: true,
  // todo: type env vars
  baseUrl: process.env.NEXT_PUBLIC_API_URL as string,
  baseHeaders: {},
  // api: async ({ path, method, headers, body }) => {
  //   try {
  //     const result = await axios.request({
  //       method: method as Method,
  //       url: path,
  //       headers,
  //       data: body,
  //     });

  //     return result;
  //   } catch (e: Error | unknown) {
  //     if (isAxiosError(e)) {
  //       const response = e.response as AxiosResponse;
  //       return {
  //         status: response.status,
  //         body: response.data,
  //         headers: response.headers,
  //       };
  //     }

  //     throw e;
  //   }
  // },
});
