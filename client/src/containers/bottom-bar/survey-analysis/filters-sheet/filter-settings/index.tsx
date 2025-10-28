import { FC, useMemo } from "react";

import { PageFilter } from "@shared/dto/widgets/page-filter.entity";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import FilterSettingsButton from "@/containers/bottom-bar/projections/filters-sheet/filter-settings/button";
import { useFilterSettings } from "@/containers/bottom-bar/projections/filters-sheet/filter-settings/hooks";

interface FilterSettingsProps {
  defaultFilters: string[];
}

const FilterSettings: FC<FilterSettingsProps> = ({ defaultFilters }) => {
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
            />
          ))}
          <FilterSettingsButton
            key="bottom-bar-filter-popover-custom"
            name="More filters"
            allFilters={customFilters}
          />
        </>
      )}
    </div>
  );
};

export default FilterSettings;
