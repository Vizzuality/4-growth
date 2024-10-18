import { FC } from "react";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import useFilters from "@/hooks/useFilters";

import FilterPopup from "@/containers/sidebar/filter-settings/filter-popup";

import { Button } from "@/components/ui/button";

const DEFAULT_FILTERS = ["eu-member-state", "type-of-data"];

const FilterSettings: FC = () => {
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
      {data
        ?.filter((pageFilter) => DEFAULT_FILTERS.includes(pageFilter.name))
        .map((f) => (
          <FilterPopup
            key={`sidebar-filter-popover-${f.name}`}
            name={f.name}
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
      <Button
        variant="clean"
        className="w-full justify-start rounded-none px-4 py-3.5 font-normal transition-colors hover:bg-secondary"
      >
        Add a data breakdown
      </Button>
    </>
  );
};

export default FilterSettings;
