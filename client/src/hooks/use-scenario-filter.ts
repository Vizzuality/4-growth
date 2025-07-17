import { useCallback, useMemo } from "react";

import useFilters from "@/hooks/use-filters";

export default function useScenarioFilter() {
  const { filters, addFilter } = useFilters();
  const { scenarioFilter, selectedScenarios } = useMemo(() => {
    const scenarioFilter = filters.find((f) => f.name === "scenario");
    return {
      scenarioFilter,
      selectedScenarios: scenarioFilter?.values || [],
    };
  }, [filters]);

  const toggleScenario = useCallback(
    (value: string) => {
      if (!selectedScenarios.includes(value)) {
        addFilter({ name: "scenario", operator: "=", values: [value] });
      }
    },
    [selectedScenarios, addFilter],
  );

  return { scenarioFilter, selectedScenarios, toggleScenario };
}
