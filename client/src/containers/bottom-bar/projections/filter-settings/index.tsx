"use client";
import { FC, useMemo } from "react";

import { PageFilter } from "@shared/dto/widgets/page-filter.entity";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { normalizeProjectionsFilterValues } from "@/lib/utils";

import useSettings from "@/hooks/use-settings";

import FilterSettingsButton from "@/containers/bottom-bar/projections/filter-settings/button";
import { SCENARIOS } from "@/containers/scenarios/constants";
import { DEFAULT_FILTERS_LABEL_MAP } from "@/containers/sidebar/filter-settings/constants";

import { filterProjectionsFilters } from "@/utils/filters";

const SCENARIO_PAGE_FILTER = {
  name: "scenario",
  label: "Scenario",
  values: SCENARIOS.map((s) => s.value),
} as PageFilter;

interface FilterSettingsProps {
  defaultFilters: string[];
}

const FilterSettings: FC<FilterSettingsProps> = ({ defaultFilters }) => {
  const { settings } = useSettings();
  const isTableVisualization = settings !== null && "table" in settings;

  const projectionsFiltersQuery =
    client.projections.getProjectionsFilters.useQuery(
      queryKeys.projections.filters.queryKey,
      {},
      {
        select: (res) => normalizeProjectionsFilterValues(res.body.data),
      },
    );

  const allFilters = useMemo(
    () => filterProjectionsFilters(projectionsFiltersQuery?.data),
    [projectionsFiltersQuery.data],
  );

  const customFilters = useMemo(
    () => allFilters.filter((f) => !defaultFilters.includes(f.name)) || [],
    [allFilters, defaultFilters],
  );

  const effectiveAllFilters = useMemo(() => {
    let filters;
    if (customFilters.length <= 1) {
      filters = allFilters;
    } else {
      filters = allFilters.filter((pageFilter) =>
        defaultFilters.includes(pageFilter.name),
      );
    }

    if (isTableVisualization) {
      return [...filters, SCENARIO_PAGE_FILTER];
    }

    return filters;
  }, [allFilters, defaultFilters, customFilters, isTableVisualization]);

  return (
    <div className="">
      {effectiveAllFilters.map((f) => (
        <FilterSettingsButton
          key={`filter-${f.name}`}
          allFilters={effectiveAllFilters}
          fixedFilter={f}
          name={f.name}
          label={DEFAULT_FILTERS_LABEL_MAP[f.name]}
        />
      ))}
    </div>
  );
};

export default FilterSettings;
