import { useCallback, useMemo } from "react";

import { ADD_FILTER_MODE } from "@/lib/constants";

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
    (scenario: string) => {
      addFilter(
        { name: "scenario", operator: "=", values: [scenario] },
        ADD_FILTER_MODE.REPLACE,
      );
    },
    [addFilter],
  );

  return { scenarioFilter, selectedScenarios, toggleScenario };
}
