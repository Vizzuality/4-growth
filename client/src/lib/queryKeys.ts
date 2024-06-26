import {
  createQueryKeys,
  mergeQueryKeys,
} from "@lukemorales/query-key-factory";

export const usersKeys = createQueryKeys("users", {
  detail: (userId: string) => [userId],
});

export const queryKeys = mergeQueryKeys(usersKeys);
