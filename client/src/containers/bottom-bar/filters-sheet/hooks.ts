import { useCallback } from "react";

import { useAtom } from "jotai";

import { ADD_FILTER_MODE } from "@/lib/constants";
import { addFilterQueryParam, removeFilterQueryParamValue } from "@/lib/utils";

import { FilterQueryParam } from "@/hooks/use-filters";

import { FilterSettingsAtom } from "@/containers/bottom-bar/filters-sheet/store";

export function useFilterSettings() {
  const [newFilters, setNewFilters] = useAtom(FilterSettingsAtom);

  const addFilter = useCallback(
    (newFilter: FilterQueryParam) => {
      if (newFilter.values.length) {
        setNewFilters(
          addFilterQueryParam(newFilters, newFilter, ADD_FILTER_MODE.REPLACE),
        );
      } else if (newFilter.values.length === 0) {
        setNewFilters(
          newFilters.filter((filter) => filter.name !== newFilter.name),
        );
      }
    },
    [newFilters, setNewFilters],
  );

  const removeFilterValue = useCallback(
    (name: string, valueToRemove: string) => {
      setNewFilters(
        removeFilterQueryParamValue(newFilters, name, valueToRemove),
      );
    },
    [newFilters, setNewFilters],
  );

  return { filters: newFilters, addFilter, removeFilterValue };
}
