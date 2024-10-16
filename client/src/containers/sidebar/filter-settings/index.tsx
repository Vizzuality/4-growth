import { FC } from "react";

import { useSetAtom } from "jotai";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import FilterSelect from "@/containers/filter/filter-select";
import { isPopoverOpenAtom } from "@/containers/sidebar/store";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DEFAULT_FILTERS = ["eu-member-state", "type-of-data"];
const POPOVER_CONTENT_CLASS = "ml-4 h-[320px] w-full min-w-[320px]";

const FilterSettings: FC = () => {
  const filtersQuery = client.pageFilter.searchFilters.useQuery(
    queryKeys.pageFilters.all.queryKey,
    {},
    { select: (res) => res.body.data },
  );
  const setIsPopoverOpen = useSetAtom(isPopoverOpenAtom);

  return (
    <>
      {filtersQuery.data
        ?.filter((pageFilter) => DEFAULT_FILTERS.includes(pageFilter.name))
        .map((f) => (
          <Popover
            key={`sidebar-filter-popover-${f.name}`}
            onOpenChange={setIsPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="clean"
                className="w-full justify-start rounded-none px-4 py-3.5 font-normal transition-colors hover:bg-secondary"
              >
                {f.name}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              side="bottom"
              className={POPOVER_CONTENT_CLASS}
            >
              <FilterSelect
                items={filtersQuery.data || []}
                fixedFilter={f}
                onSubmit={() => {
                  // TODO: implemenation will be added in seperate PR
                }}
              />
            </PopoverContent>
          </Popover>
        ))}
      <Popover onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="clean"
            className="w-full justify-start rounded-none px-4 py-3.5 font-normal transition-colors hover:bg-secondary"
          >
            Add a custom filter
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="bottom"
          className={POPOVER_CONTENT_CLASS}
        >
          <FilterSelect
            items={filtersQuery.data || []}
            onSubmit={() => {
              // TODO: implemenation will be added in seperate PR
            }}
          />
        </PopoverContent>
      </Popover>

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
