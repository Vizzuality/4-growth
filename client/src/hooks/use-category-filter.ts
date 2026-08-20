import { useCallback, useMemo } from "react";

import {
  CATEGORY_FILTER_NAME,
  CATEGORY_SCOPED_FILTER_NAMES,
} from "@/lib/constants";

import useFilters from "@/hooks/use-filters";

export default function useProjectionsCategoryFilter() {
  const { filters, setFilters } = useFilters();

  const { categoryFilter, selectedCategories } = useMemo(() => {
    const categoryFilter = filters.find((f) => f.name === CATEGORY_FILTER_NAME);

    return {
      categoryFilter,
      selectedCategories: categoryFilter?.values || [],
    };
  }, [filters]);
  const isCategorySelected = !!categoryFilter;

  const toggleCategory = useCallback(
    (category: string) => {
      if (selectedCategories[0] === category) return;

      const kept = filters.filter(
        (f) =>
          f.name !== CATEGORY_FILTER_NAME &&
          !CATEGORY_SCOPED_FILTER_NAMES.includes(f.name),
      );
      setFilters([
        ...kept,
        { name: CATEGORY_FILTER_NAME, operator: "=", values: [category] },
      ]);
    },
    [filters, selectedCategories, setFilters],
  );

  return {
    categoryFilter,
    selectedCategories,
    isCategorySelected,
    toggleCategory,
  };
}
