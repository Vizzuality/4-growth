import { useCallback, useMemo } from "react";

import useFilters from "@/hooks/use-filters";

export default function useScenarioFilter() {
  const { filters, addFilter, removeFilter } = useFilters();
  const { scenarioFilter, selectedScenarios } = useMemo(() => {
    const scenarioFilter = filters.find((f) => f.name === "scenario");
    return {
      scenarioFilter,
      selectedScenarios: scenarioFilter?.values || [],
    };
  }, [filters]);

  const toggleScenario = useCallback(
    (value: string) => {
      const newValues = selectedScenarios.includes(value)
        ? selectedScenarios.filter((v) => v !== value)
        : [...selectedScenarios, value];

      if (newValues.length === 0) {
        removeFilter("scenario");
      } else {
        addFilter({ name: "scenario", operator: "=", values: newValues });
      }
    },
    [selectedScenarios, addFilter, removeFilter],
  );

  return { scenarioFilter, selectedScenarios, toggleScenario };
}
