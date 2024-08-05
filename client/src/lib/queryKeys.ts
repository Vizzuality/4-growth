import {
  createQueryKeys,
  mergeQueryKeys,
} from "@lukemorales/query-key-factory";

export const usersKeys = createQueryKeys("users", {
  detail: (userId: string) => [userId],
  userCharts: (userId: string, options: Record<string, unknown>) => [
    "charts",
    options,
  ],
});

export const queryKeys = mergeQueryKeys(usersKeys);
