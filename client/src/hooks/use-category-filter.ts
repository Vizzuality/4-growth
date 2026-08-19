import { useCallback, useMemo } from "react";

import useFilters from "@/hooks/use-filters";

export default function useProjectionsCategoryFilter() {
  const { filters, setFilters } = useFilters();

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
      const cleared = filters.filter(
        (f) =>
          f.name !== "technology" &&
          f.name !== "technology-type" &&
          f.name !== "category",
      );
      setFilters([
        ...cleared,
        { name: "category", operator: "=", values: [category] },
      ]);
    },
    [filters, setFilters],
  );

  return {
    categoryFilter,
    selectedCategories,
    isCategorySelected,
    toggleCategory,
  };
}
