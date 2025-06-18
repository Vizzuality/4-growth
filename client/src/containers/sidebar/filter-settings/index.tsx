import { FC, useMemo } from "react";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { CountryISO3Map } from "@shared/constants/country-iso3.map";

import { FilterQueryParam } from "@/hooks/use-filters";

import BreakdownSelector from "@/containers/sidebar/breakdown-selector";
import { DEFAULT_FILTERS_LABEL_MAP } from "@/containers/sidebar/filter-settings/constants";
import FilterPopup from "@/containers/sidebar/filter-settings/filter-popup";
import { normalizeProjectionsFilterValues } from "@/lib/utils";

interface FilterSettingsProps {
  type: "projections" | "surveyAnalysis";
  defaultFilters: string[];
  filterQueryParams: FilterQueryParam[];
  onAddFilter: (newFilter: FilterQueryParam) => void;
  onRemoveFilterValue: (name: string, valueToRemove: string) => void;
  withDataBreakdown?: boolean;
}

const FilterSettings: FC<FilterSettingsProps> = ({
  type,
  defaultFilters,
  filterQueryParams,
  withDataBreakdown,
  onAddFilter,
  onRemoveFilterValue,
}) => {
  const surveyAnalysisFiltersQuery = client.pageFilter.searchFilters.useQuery(
    queryKeys.pageFilters.all.queryKey,
    {},
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
  const selectedCustomFilters = filterQueryParams.filter(
    (f) => !defaultFilters.includes(f.name),
  );

  const allFilters = useMemo(() => {
    if (type === "surveyAnalysis") {
      return surveyAnalysisFiltersQuery.data || [];
    } else {
      return projectionsFiltersQuery.data || [];
    }
  }, [type, surveyAnalysisFiltersQuery.data, projectionsFiltersQuery.data]);

  const customFilters = useMemo(
    () =>
      allFilters.filter((f) => {
        if (type === "projections" && f.name === "scenario") {
          return false;
        }
        return !defaultFilters.includes(f.name);
      }) || [],
    [allFilters, defaultFilters, type],
  );

  return (
    <>
      {allFilters
        .filter((pageFilter) => defaultFilters.includes(pageFilter.name))
        .map((f) => (
          <FilterPopup
            key={`sidebar-filter-popover-${f.name}`}
            name={f.name}
            filterQueryParams={filterQueryParams}
            onAddFilter={onAddFilter}
            onRemoveFilterValue={onRemoveFilterValue}
            label={DEFAULT_FILTERS_LABEL_MAP[f.name]}
            filters={allFilters}
            fixedFilter={f}
          />
        ))}

      {selectedCustomFilters.map((f) => (
        <FilterPopup
          key={`sidebar-filter-popover-${f.name}`}
          name={f.name}
          filterQueryParams={filterQueryParams}
          onAddFilter={onAddFilter}
          onRemoveFilterValue={onRemoveFilterValue}
          filters={customFilters}
          fixedFilter={f}
        />
      ))}
      <FilterPopup
        key="sidebar-filter-popover-custom"
        name="Add a custom filter"
        filterQueryParams={filterQueryParams}
        onAddFilter={onAddFilter}
        onRemoveFilterValue={onRemoveFilterValue}
        filters={customFilters}
      />
      {withDataBreakdown && <BreakdownSelector />}
    </>
  );
};

export default FilterSettings;
