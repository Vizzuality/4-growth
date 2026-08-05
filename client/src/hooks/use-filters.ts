import { useCallback, useMemo } from "react";

import { usePathname } from "next/navigation";

import {
  VALID_SEARCH_WIDGET_DATA_OPERATORS,
  WidgetDataFilterOperatorType,
} from "@shared/dto/global/search-widget-data-params";
import { useQueryState } from "nuqs";
import qs from "qs";

import {
  ADD_FILTER_MODE,
  DATA_SOURCE_FILTER_NAME,
  DEFAULT_DATA_SOURCE_VALUES,
} from "@/lib/constants";
import { addFilterQueryParam, removeFilterQueryParamValue } from "@/lib/utils";

export interface FilterQueryParam {
  name: string;
  operator: WidgetDataFilterOperatorType;
  values: string[];
}

const SURVEY_ANALYSIS_PATHNAME = /^\/survey-analysis(?:\/|$)/;
const PROJECTIONS_PATHNAME = /^\/projections(?:\?.*)?$/;

// Filters that survive "Clear all" — so clearing them is never offered as a no-op.
const PRESERVED_FILTER_NAMES = [
  "scenario",
  "category",
  DATA_SOURCE_FILTER_NAME,
];

export const isPreservedFilter = (name: string) =>
  PRESERVED_FILTER_NAMES.includes(name);

export const hasClearableFilters = (filters: FilterQueryParam[]) =>
  filters.some((filter) => !isPreservedFilter(filter.name));

/**
 * Survey analysis always sends an explicit data source; absence of the filter
 * means all sources to the API, which is not the resting state we want.
 * Must never apply to projections — that query path has no data-source branch,
 * so the filter would be read as a question indicator and match nothing.
 */
export function withDataSourceDefault(
  filters: FilterQueryParam[],
): FilterQueryParam[] {
  if (filters.some((filter) => filter.name === DATA_SOURCE_FILTER_NAME)) {
    return filters;
  }

  return [
    {
      name: DATA_SOURCE_FILTER_NAME,
      operator: "=",
      values: [...DEFAULT_DATA_SOURCE_VALUES],
    },
    ...filters,
  ];
}

type ParsedFilterObject = {
  [K in keyof FilterQueryParam]: K extends "values"
    ? string | string[]
    : string;
} & { [key: string]: unknown };

function useFilters() {
  const pathname = usePathname();
  const [filtersQuery, setFiltersQuery] = useQueryState("q");
  const filters = useMemo(() => {
    const isSurveyAnalysis = SURVEY_ANALYSIS_PATHNAME.test(pathname);
    const applyDefaults = (parsed: FilterQueryParam[]) =>
      isSurveyAnalysis ? withDataSourceDefault(parsed) : parsed;

    if (!filtersQuery)
      return PROJECTIONS_PATHNAME.test(pathname)
        ? ([
            {
              name: "scenario",
              operator: "=",
              values: ["baseline"],
            },
          ] as FilterQueryParam[])
        : applyDefaults([]);

    try {
      const parsed = qs.parse(filtersQuery);

      if (!Array.isArray(parsed.filters)) {
        throw new Error("Filters must be an array");
      }

      return applyDefaults(
        parsed.filters.map((filter, index: number) =>
          validateFilterQueryParam(filter as ParsedFilterObject, index),
        ),
      );
    } catch (error) {
      console.error("Error parsing filters:", error);
      return applyDefaults([]);
    }
  }, [filtersQuery, pathname]);

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
    (
      newFilter: FilterQueryParam,
      mode: ADD_FILTER_MODE = ADD_FILTER_MODE.MERGE,
    ) => {
      setFilters(addFilterQueryParam(filters, newFilter, mode));
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

  const removeAll = useCallback(() => {
    setFilters(filters.filter((filter) => isPreservedFilter(filter.name)));
  }, [filters, setFilters]);

  return {
    filters,
    setFilters,
    addFilter,
    removeFilterValue,
    removeFilter,
    removeAll,
  };
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
