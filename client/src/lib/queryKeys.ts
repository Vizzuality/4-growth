import {
  createQueryKeys,
  mergeQueryKeys,
} from "@lukemorales/query-key-factory";
import { CustomProjectionSettingsType } from "@shared/schemas/custom-projection-settings.schema";

import { FilterQueryParam } from "@/hooks/use-filters";

export const usersKeys = createQueryKeys("users", {
  detail: (userId: string) => [userId],
  userChart: (customWidgetId: string) => ["chart", customWidgetId],
  userCharts: (userId: string, options: Record<string, unknown>) => [
    "charts",
    userId,
    options,
  ],
});

export const sectionsKeys = createQueryKeys("sections", {
  all: (filters: FilterQueryParam[]) => ({
    queryKey: [{ filters }],
  }),
});

export const pageFiltersKeys = createQueryKeys("pageFilters", {
  all: (filters: FilterQueryParam[]) => ({
    queryKey: [{ filters }],
  }),
});

export const widgetsKeys = createQueryKeys("widgets", {
  all: null,
  one: (indicator: string, filters: FilterQueryParam[], breakdown?: string) => [
    indicator,
    { filters },
    breakdown,
  ],
});

export const projectionsKeys = createQueryKeys("projections", {
  widgets: (dataFilters: FilterQueryParam[]) => ({
    queryKey: [{ dataFilters }],
  }),
  custom: (
    settings: CustomProjectionSettingsType | null,
    filters: FilterQueryParam[],
  ) => [{ settings, filters }],
  settings: null,
  settingsAll: null,
  filters: null,
});

export const queryKeys = mergeQueryKeys(
  usersKeys,
  sectionsKeys,
  pageFiltersKeys,
  widgetsKeys,
  projectionsKeys,
);
