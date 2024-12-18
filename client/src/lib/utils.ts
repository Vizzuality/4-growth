import { BaseWidgetWithData } from "@shared/dto/widgets/base-widget-data.interface";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { FilterQueryParam } from "./../hooks/use-filters";

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
): FilterQueryParam[] {
  let updatedFilters = filters.slice();

  if (!updatedFilters.some((filter) => filter.name === newFilter.name)) {
    updatedFilters.push(newFilter);
  } else {
    updatedFilters = filters.map((filter) => {
      if (filter.name === newFilter.name) {
        return {
          ...filter,
          values: newFilter.values,
        };
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
