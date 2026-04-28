import qs from "qs";

import { env } from "@/env";

import { FilterQueryParam } from "@/hooks/use-filters";

export function buildWidgetDownloadUrl(
  indicator: string,
  filters: FilterQueryParam[],
  breakdown?: string,
): string {
  return `${env.NEXT_PUBLIC_API_URL}/widgets/${indicator}/export?${qs.stringify(
    { filters, ...(breakdown ? { breakdown } : {}) },
    { encode: false },
  )}`;
}

export function buildProjectionDownloadUrl(
  filters: FilterQueryParam[],
  settings: Record<string, unknown> | null,
  othersAggregation: string,
): string {
  return `${env.NEXT_PUBLIC_API_URL}/projections/custom-widget/export?${qs.stringify(
    { filters, settings, othersAggregation },
    { encode: false },
  )}`;
}
