import { FC, useMemo } from "react";

import { ProjectionFilter } from "@shared/dto/projections/projection-filter.entity";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { normalizeProjectionsFilterValues } from "@/lib/utils";

import useFilters, { FilterQueryParam } from "@/hooks/use-filters";

import { DEFAULT_FILTERS_LABEL_MAP } from "@/containers/sidebar/filter-settings/constants";
import FilterPopup from "@/containers/sidebar/filter-settings/filter-popup";

import { filterProjectionsFilters } from "@/utils/filters";

interface FilterSettingsProps {
  type: "projections" | "surveyAnalysis";
  defaultFilters: string[];
  filterQueryParams: FilterQueryParam[];
  onAddFilter: (newFilter: FilterQueryParam) => void;
  onRemoveFilterValue: (name: string, valueToRemove: string) => void;
}

const FilterSettings: FC<FilterSettingsProps> = ({
  type,
  defaultFilters,
  filterQueryParams,
  onAddFilter,
  onRemoveFilterValue,
}) => {
  const { filters } = useFilters();
  const surveyAnalysisFiltersQuery = client.pageFilter.searchFilters.useQuery(
    queryKeys.pageFilters.all(filters).queryKey,
    { query: { filters } },
    { select: (res) => res.body.data, enabled: type === "surveyAnalysis" },
  );
  const projectionsFiltersQuery =
    client.projections.getProjectionsFilters.useQuery(
      queryKeys.projections.filters.queryKey,
      {},
      {
        select: (res) => normalizeProjectionsFilterValues(res.body.data),
        enabled: type === "projections",
      },
    );
  const selectedCustomFilters = filterQueryParams.filter((f) => {
    if (type === "projections" && f.name === "scenario") return false;
    if (type === "projections" && f.name === "category") return false;

    return !defaultFilters.includes(f.name);
  }) as unknown as ProjectionFilter[];

  const allFilters = useMemo(() => {
    if (type === "surveyAnalysis") {
      return surveyAnalysisFiltersQuery.data || [];
    } else {
      return filterProjectionsFilters(projectionsFiltersQuery?.data);
    }
  }, [type, surveyAnalysisFiltersQuery.data, projectionsFiltersQuery.data]);

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
    <>
      {effectiveAllFilters.map((f) => (
        <FilterPopup
          key={`sidebar-filter-popover-${f.name}`}
          name={f.name}
          filterQueryParams={filterQueryParams}
          onAddFilter={onAddFilter}
          onRemoveFilterValue={onRemoveFilterValue}
          label={DEFAULT_FILTERS_LABEL_MAP[f.name]}
          filters={effectiveAllFilters}
          fixedFilter={f}
        />
      ))}

      {customFilters.length > 1 && (
        <>
          {selectedCustomFilters.map((f) => (
            <FilterPopup
              key={`sidebar-filter-popover-${f.name}`}
              name={f.name}
              label={{ selected: f.label, unSelected: f.label }}
              filterQueryParams={filterQueryParams}
              onAddFilter={onAddFilter}
              onRemoveFilterValue={onRemoveFilterValue}
              filters={customFilters}
              fixedFilter={f}
            />
          ))}
          <FilterPopup
            key="sidebar-filter-popover-custom"
            name="More filters"
            filterQueryParams={filterQueryParams}
            onAddFilter={onAddFilter}
            onRemoveFilterValue={onRemoveFilterValue}
            filters={customFilters}
          />
        </>
      )}
    </>
  );
};

export default FilterSettings;
