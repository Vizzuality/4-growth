import { useCallback, useMemo } from "react";

import {
  VALID_SEARCH_WIDGET_DATA_OPERATORS,
  WidgetDataFilterOperatorType,
} from "@shared/dto/global/search-widget-data-params";
import {
  AVAILABLE_PAGE_FILTER_NAMES,
  PageFilterQuestionKey,
} from "@shared/dto/widgets/page-filter-question-map";
import { useQueryState } from "nuqs";
import qs from "qs";

interface FilterQueryParam {
  name: PageFilterQuestionKey;
  operator: WidgetDataFilterOperatorType;
  value: string[];
}

type ParsedFilterObject = {
  [K in keyof FilterQueryParam]: K extends "value" ? string | string[] : string;
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

  return { filters, setFilters };
}

const REQUIRED_KEYS = ["name", "operator", "value"];

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

  // Check if name is valid
  if (!AVAILABLE_PAGE_FILTER_NAMES.includes(obj.name)) {
    throw new Error(
      `Filter at index ${index} has invalid 'name': "${obj.name}".`,
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

  // Check if value is a non-empty array of strings
  if (!Array.isArray(obj.value) || obj.value.length === 0) {
    throw new Error(
      `Filter at index ${index} has invalid 'value': expected a non-empty array, got ${JSON.stringify(obj.value)}`,
    );
  }

  return obj as FilterQueryParam;
}

export default useFilters;
