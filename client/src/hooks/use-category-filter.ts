import { useCallback, useMemo } from "react";

import { ADD_FILTER_MODE } from "@/lib/constants";

import useFilters from "@/hooks/use-filters";

export default function useProjectionsCategoryFilter() {
  const { filters, addFilter } = useFilters();

  const { categoryFilter, selectedCategories } = useMemo(() => {
    const categoryFilter = filters.find((f) => f.name === "category");

    return {
      categoryFilter,
      selectedCategories: categoryFilter?.values || [],
    };
  }, [filters]);
  const isCategorySelected = !!categoryFilter;

  const toggleCategory = useCallback(
    (category: string) => {
      addFilter(
        { name: "category", operator: "=", values: [category] },
        ADD_FILTER_MODE.REPLACE,
      );
    },
    [addFilter],
  );

  return {
    categoryFilter,
    selectedCategories,
    isCategorySelected,
    toggleCategory,
  };
}
