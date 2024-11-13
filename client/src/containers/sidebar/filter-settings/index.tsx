import { FC } from "react";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import { FilterQueryParam } from "@/hooks/use-filters";

import BreakdownSelector from "@/containers/sidebar/breakdown-selector";
import FilterPopup from "@/containers/sidebar/filter-settings/filter-popup";

const DEFAULT_FILTERS = ["location-country-region", "sector"];
const DEFAULT_FILTERS_LABEL_MAP: {
  [key: string]: { selected: string; unSelected: string };
} = {
  "location-country-region": {
    selected: "Country",
    unSelected: "All countries",
  },
  sector: {
    selected: "Sector",
    unSelected: "All operation areas",
  },
} as const;

interface FilterSettingsProps {
  filterQueryParams: FilterQueryParam[];
  onAddFilter: (newFilter: FilterQueryParam) => void;
  onRemoveFilterValue: (name: string, valueToRemove: string) => void;
  withDataBreakdown?: boolean;
}

const FilterSettings: FC<FilterSettingsProps> = ({
  filterQueryParams,
  withDataBreakdown,
  onAddFilter,
  onRemoveFilterValue,
}) => {
  const filtersQuery = client.pageFilter.searchFilters.useQuery(
    queryKeys.pageFilters.all.queryKey,
    {},
    { select: (res) => res.body.data },
  );
  const selectedCustomFilters = filterQueryParams.filter(
    (f) => !DEFAULT_FILTERS.includes(f.name),
  );
  const customFilters =
    filtersQuery.data?.filter((f) => !DEFAULT_FILTERS.includes(f.name)) || [];

  return (
    <>
      {filtersQuery.data
        ?.filter((pageFilter) => DEFAULT_FILTERS.includes(pageFilter.name))
        .map((f) => (
          <FilterPopup
            key={`sidebar-filter-popover-${f.name}`}
            name={f.name}
            filterQueryParams={filterQueryParams}
            onAddFilter={onAddFilter}
            onRemoveFilterValue={onRemoveFilterValue}
            label={DEFAULT_FILTERS_LABEL_MAP[f.name]}
            filters={filtersQuery.data || []}
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
