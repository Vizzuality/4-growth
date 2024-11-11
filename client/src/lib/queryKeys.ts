import {
  createQueryKeys,
  mergeQueryKeys,
} from "@lukemorales/query-key-factory";

import { FilterQueryParam } from "@/hooks/use-filters";

export const usersKeys = createQueryKeys("users", {
  detail: (userId: string) => [userId],
  userCharts: (userId: string, options: Record<string, unknown>) => [
    "charts",
    options,
  ],
});

export const sectionsKeys = createQueryKeys("sections", {
  all: (filters: FilterQueryParam[]) => ({
    queryKey: [{ filters }],
  }),
});

export const pageFiltersKeys = createQueryKeys("pageFilters", {
  all: null,
});

export const widgetsKeys = createQueryKeys("widgets", {
  all: null,
  one: (indicator: string, filters: FilterQueryParam[]) => [
    indicator,
    { filters },
  ],
});

export const queryKeys = mergeQueryKeys(
  usersKeys,
  sectionsKeys,
  pageFiltersKeys,
  widgetsKeys,
);
