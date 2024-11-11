import { FC } from "react";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import useFilters from "@/hooks/use-filters";

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

const FilterSettings: FC<{ withDataBreakdown?: boolean }> = ({
  withDataBreakdown,
}) => {
  const { filters } = useFilters();
  const filtersQuery = client.pageFilter.searchFilters.useQuery(
    queryKeys.pageFilters.all.queryKey,
    {},
    { select: (res) => res.body.data },
  );
  const selectedCustomFilters = filters.filter(
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
            label={DEFAULT_FILTERS_LABEL_MAP[f.name]}
            items={filtersQuery.data || []}
            fixedFilter={f}
          />
        ))}

      {selectedCustomFilters.map((f) => (
        <FilterPopup
          key={`sidebar-filter-popover-${f.name}`}
          name={f.name}
          items={customFilters}
          fixedFilter={f}
        />
      ))}
      <FilterPopup
        key="sidebar-filter-popover-custom"
        name="Add a custom filter"
        items={customFilters}
      />
      {withDataBreakdown && <BreakdownSelector />}
    </>
  );
};

export default FilterSettings;
