"use client";
import { FC, useMemo } from "react";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { normalizeProjectionsFilterValues } from "@/lib/utils";

import FilterSettingsButton from "@/containers/bottom-bar/projections/filter-settings/button";
import { DEFAULT_FILTERS_LABEL_MAP } from "@/containers/sidebar/filter-settings/constants";

interface FilterSettingsProps {
  defaultFilters: string[];
}

const FilterSettings: FC<FilterSettingsProps> = ({ defaultFilters }) => {
  const projectionsFiltersQuery =
    client.projections.getProjectionsFilters.useQuery(
      queryKeys.projections.filters.queryKey,
      {},
      {
        select: (res) => normalizeProjectionsFilterValues(res.body.data),
      },
    );

  const allFilters = useMemo(
    () =>
      projectionsFiltersQuery.data?.filter((f) => f.name !== "scenario") || [],
    [projectionsFiltersQuery.data],
  );

  const customFilters = useMemo(
    () => allFilters.filter((f) => !defaultFilters.includes(f.name)) || [],
    [allFilters, defaultFilters],
  );

  const effectiveAllFilters = useMemo(() => {
    if (customFilters.length <= 1) {
      return allFilters;
    }
    return allFilters.filter((pageFilter) =>
      defaultFilters.includes(pageFilter.name),
    );
  }, [allFilters, defaultFilters, customFilters]);

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
