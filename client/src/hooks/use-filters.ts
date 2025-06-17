import { useCallback, useMemo } from "react";

import {
  VALID_SEARCH_WIDGET_DATA_OPERATORS,
  WidgetDataFilterOperatorType,
} from "@shared/dto/global/search-widget-data-params";
import { useQueryState } from "nuqs";
import qs from "qs";

import { addFilterQueryParam, removeFilterQueryParamValue } from "@/lib/utils";

export interface FilterQueryParam {
  name: string;
  operator: WidgetDataFilterOperatorType;
  values: string[];
}

type ParsedFilterObject = {
  [K in keyof FilterQueryParam]: K extends "values"
    ? string | string[]
    : string;
} & { [key: string]: unknown };

function useFilters() {
  const [filtersQuery, setFiltersQuery] = useQueryState("q");
  const filters = useMemo(() => {
    if (!filtersQuery) return [];

    try {
      const parsed = qs.parse(filtersQuery);

      if (!Array.isArray(parsed.filters)) {
        throw new Error("Filters must be an array");
      }

      return parsed.filters.map((filter, index: number) =>
        validateFilterQueryParam(filter as ParsedFilterObject, index),
      );
    } catch (error) {
      console.error("Error parsing filters:", error);
      return [];
    }
  }, [filtersQuery]);

  const setFilters = useCallback(
    (newFilters: FilterQueryParam[]) => {
      const stringified = qs.stringify(
        { filters: newFilters },
        { encode: false },
      );
      setFiltersQuery(stringified);
    },
    [setFiltersQuery],
  );

  const addFilter = useCallback(
    (newFilter: FilterQueryParam) => {
      setFilters(addFilterQueryParam(filters, newFilter));
    },
    [filters, setFilters],
  );

  const removeFilterValue = useCallback(
    (name: string, valueToRemove: string) => {
      setFilters(removeFilterQueryParamValue(filters, name, valueToRemove));
    },
    [filters, setFilters],
  );

  const removeFilter = useCallback(
    (name: string) => {
      setFilters(filters.filter((filter) => filter.name !== name));
    },
    [filters, setFilters],
  );

  return { filters, setFilters, addFilter, removeFilterValue, removeFilter };
}

const REQUIRED_KEYS = ["name", "operator", "values"];

function validateFilterQueryParam(
  obj: ParsedFilterObject,
  index: number,
): FilterQueryParam {
  // Check if all required keys are present
  const missingKeys = REQUIRED_KEYS.filter((key) => !(key in obj));
  if (missingKeys.length > 0) {
    throw new Error(
      `Filter at index ${index} is missing required keys: ${missingKeys.join(", ")}`,
    );
  }

  // Check if operator is valid
  if (
    !VALID_SEARCH_WIDGET_DATA_OPERATORS.includes(
      obj.operator as WidgetDataFilterOperatorType,
    )
  ) {
    throw new Error(
      `Filter at index ${index} has invalid 'operator': "${obj.operator}".`,
    );
  }

  // Check if values is a non-empty array of strings
  if (!Array.isArray(obj.values) || obj.values.length === 0) {
    throw new Error(
      `Filter at index ${index} has invalid 'values': expected a non-empty array, got ${JSON.stringify(obj.values)}`,
    );
  }

  return obj as FilterQueryParam;
}

export default useFilters;
