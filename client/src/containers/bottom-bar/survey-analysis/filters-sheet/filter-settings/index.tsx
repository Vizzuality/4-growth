"use client";
import { FC, useMemo } from "react";

import { PageFilter } from "@shared/dto/widgets/page-filter.entity";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import { useFilterSettings } from "@/containers/bottom-bar/filters-sheet/hooks";
import FilterSettingsButton from "@/containers/bottom-bar/projections/filter-settings/button";
import BreakdownSelector from "@/containers/bottom-bar/survey-analysis/filters-sheet/data-breakdown";
import { DEFAULT_FILTERS_LABEL_MAP } from "@/containers/sidebar/filter-settings/constants";

interface FilterSettingsProps {
  defaultFilters: string[];
  withDataBreakdown?: boolean;
}

const FilterSettings: FC<FilterSettingsProps> = ({
  defaultFilters,
  withDataBreakdown,
}) => {
  const { filters } = useFilterSettings();
  const surveyAnalysisFiltersQuery = client.pageFilter.searchFilters.useQuery(
    queryKeys.pageFilters.all(filters).queryKey,
    { query: { filters } },
    { select: (res) => res.body.data },
  );

  const allFilters = useMemo(
    () => surveyAnalysisFiltersQuery?.data || [],
    [surveyAnalysisFiltersQuery?.data],
  );

  const customFilters = useMemo(
    () => allFilters.filter((f) => !defaultFilters.includes(f.name)) || [],
    [allFilters, defaultFilters],
  );
  const selectedCustomFilters = filters.filter(
    (f) => !defaultFilters.includes(f.name),
  ) as unknown as PageFilter[];

  const effectiveAllFilters = useMemo(() => {
    if (customFilters.length <= 1) {
      return allFilters;
    }
    return allFilters.filter((pageFilter) =>
      defaultFilters.includes(pageFilter.name),
    );
  }, [allFilters, defaultFilters, customFilters]);

  return (
    <div>
      {effectiveAllFilters.map((f) => (
        <FilterSettingsButton
          key={`filter-${f.name}`}
          allFilters={effectiveAllFilters}
          fixedFilter={f}
          name={f.name}
          label={DEFAULT_FILTERS_LABEL_MAP[f.name]}
        />
      ))}
      {customFilters.length > 1 && (
        <>
          {selectedCustomFilters.map((f) => (
            <FilterSettingsButton
              key={`filter-${f.name}`}
              allFilters={effectiveAllFilters}
              fixedFilter={f}
              name={f.name}
              label={DEFAULT_FILTERS_LABEL_MAP[f.name]}
            />
          ))}
          <FilterSettingsButton
            key="bottom-bar-filter-popover-custom"
            name="More filters"
            allFilters={customFilters}
          />
        </>
      )}
      {withDataBreakdown && <BreakdownSelector />}
    </div>
  );
};

export default FilterSettings;
