import { CountryISOMap } from "@shared/constants/country-iso.map";
import { SearchFilterOperatorType } from "@shared/dto/global/search-filters";
import { ProjectionFilter } from "@shared/dto/projections/projection-filter.entity";
import { BaseWidgetWithData } from "@shared/dto/widgets/base-widget-data.interface";
import { CustomProjectionSettingsType } from "@shared/schemas/custom-projection-settings.schema";
import { SearchFilterSchema } from "@shared/schemas/search-filters.schema";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { ADD_FILTER_MODE } from "@/lib/constants";

import { FilterQueryParam } from "@/hooks/use-filters";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSidebarLinkId = (slug?: string): string =>
  `sidebar-${slug}-link`;
export const getInPageLinkId = (slug?: string): string => `inPage-${slug}-link`;

export function isEmptyWidget(data: BaseWidgetWithData["data"]): boolean {
  return (
    !data.counter &&
    !data.breakdown &&
    !data.navigation &&
    !data.chart?.length &&
    !data.map?.length
  );
}

export function addFilterQueryParam(
  filters: FilterQueryParam[],
  newFilter: FilterQueryParam,
  mode: ADD_FILTER_MODE = ADD_FILTER_MODE.MERGE,
): FilterQueryParam[] {
  let updatedFilters = filters.slice();

  if (!updatedFilters.some((filter) => filter.name === newFilter.name)) {
    updatedFilters.push(newFilter);
  } else {
    updatedFilters = filters.map((filter) => {
      if (filter.name === newFilter.name) {
        // Merge values instead of replacing them, avoiding duplicates
        if (mode === ADD_FILTER_MODE.MERGE) {
          const existingValues = new Set(filter.values);
          newFilter.values.forEach((value) => existingValues.add(value));
          const combinedValues = Array.from(existingValues);

          return {
            ...filter,
            values: combinedValues,
            operator: filter.operator,
          } as FilterQueryParam;
        } else if (mode === ADD_FILTER_MODE.REPLACE) {
          return newFilter;
        }

        throw Error("Invalid mode for addFilterQueryParam");
      }

      return filter;
    });
  }

  return updatedFilters;
}

export function removeFilterQueryParamValue(
  filters: FilterQueryParam[],
  name: string,
  valueToRemove: string,
) {
  const updatedFilters = filters
    .map((filter) => {
      if (filter.name === name) {
        const updatedValues = filter.values.filter(
          (value) => value !== valueToRemove,
        );

        if (updatedValues.length === 0) {
          return null;
        }

        return { ...filter, values: updatedValues };
      }

      return filter;
    })
    .filter((filter): filter is FilterQueryParam => filter !== null);

  return updatedFilters;
}

export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat("en-GB", {
    style: "decimal",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    ...options,
  }).format(value);
}

export function formatAndRoundUp(value: number) {
  if (value <= 0) return String(value);

  const magnitude = Math.floor(Math.log10(value));
  const unit = Math.pow(10, magnitude);
  const roundedUp = Math.ceil(value / unit) * unit;

  return formatNumber(roundedUp, {
    maximumFractionDigits: 0,
    notation: "compact",
    compactDisplay: "short",
  });
}

export function normalizeProjectionsFilterValues(
  filters: ProjectionFilter[],
): ProjectionFilter[] {
  return filters.map((filter) => {
    if (filter.name === "country") {
      return {
        ...filter,
        values: filter.values.map(
          (value: string) => CountryISOMap.getCountryNameByISO3(value) || value,
        ),
      };
    }
    return filter;
  });
}

const operator: SearchFilterOperatorType = "=";

export function getSettingsFilters(
  settings: CustomProjectionSettingsType | null,
): Array<z.infer<typeof SearchFilterSchema>> {
  if (!settings) return [];

  if ("line_chart" in settings) {
    return Object.entries(settings.line_chart).map(([name, value]) => ({
      name: name,
      operator: operator,
      values: [value],
    }));
  }

  if ("bar_chart" in settings) {
    return Object.entries(settings.bar_chart).map(([name, value]) => ({
      name: name,
      operator: operator,
      values: [value],
    }));
  }

  if ("bubble_chart" in settings) {
    return Object.entries(settings.bubble_chart).map(([name, value]) => ({
      name: name,
      operator: operator,
      values: [value],
    }));
  }

  return [];
}
