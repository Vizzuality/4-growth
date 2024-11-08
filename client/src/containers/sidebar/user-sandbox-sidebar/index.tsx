import { FC, useCallback } from "react";

import { useAtom } from "jotai";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import { FilterQueryParam } from "@/hooks/use-filters";

import FilterSettings from "@/containers/sidebar/filter-settings";
import IndicatorSelector from "@/containers/sidebar/indicator-seletor";
import {
  sandboxFiltersAtom,
  sandboxIndicatorAtom,
  sandboxVisualizationAtom,
} from "@/containers/sidebar/store";
import VisualizationSelector from "@/containers/sidebar/visualization-selector";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const UserSandboxSidebar: FC = () => {
  const [filters, setFilters] = useAtom(sandboxFiltersAtom);
  const [indicator, setIndicator] = useAtom(sandboxIndicatorAtom);
  const [visualization, setVisualization] = useAtom(sandboxVisualizationAtom);
  const getWidgetQuery = client.widgets.getWidget.useQuery(
    queryKeys.widgets.one(indicator || "", filters).queryKey,
    {
      params: { id: indicator as string },
      query: {
        filters: filters,
      },
    },
    {
      enabled: !!indicator,
      select: (res) => res.body.data,
    },
  );

  const addFilter = useCallback(
    (newFilter: FilterQueryParam) => {
      let updatedFilters = filters.slice();

      if (!updatedFilters.some((filter) => filter.name === newFilter.name)) {
        updatedFilters.push(newFilter);
      } else {
        updatedFilters = filters.map((filter) => {
          if (filter.name === newFilter.name) {
            return {
              ...filter,
              values: newFilter.values,
            };
          }

          return filter;
        });
      }

      setFilters(updatedFilters);
    },
    [filters, setFilters],
  );

  const removeFilterValue = useCallback(
    (name: string, valueToRemove: string) => {
      const updatedFilters = filters
        .map((filter) => {
          if (filter.name === name) {
            const updatedValues = filter.values.filter(
              (value) => value !== valueToRemove,
            );

            if (updatedValues.length === 0) {
              return null;
            }

            return { ...filter, values: updatedValues };
          }

          return filter;
        })
        .filter((filter): filter is FilterQueryParam => filter !== null);
      setFilters(updatedFilters);
    },
    [filters, setFilters],
  );

  return (
    <Accordion
      key="sidebar-accordion-sandbox"
      type="multiple"
      className="w-full overflow-y-auto"
      defaultValue={["sandbox-settings", "sandbox-filters"]}
    >
      <AccordionItem value="sandbox-settings">
        <AccordionTrigger>Settings</AccordionTrigger>
        <AccordionContent className="py-3.5">
          <VisualizationSelector
            indicator={indicator}
            visualization={visualization}
            widget={getWidgetQuery.data}
            onVisualizationSelected={setVisualization}
          />
          <IndicatorSelector
            widget={getWidgetQuery.data}
            onIndicatorSelected={setIndicator}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="sandbox-filters">
        <AccordionTrigger>Filters</AccordionTrigger>
        <AccordionContent className="py-3.5">
          <FilterSettings
            filterQueryParams={filters}
            onAddFilter={addFilter}
            onRemoveFilterValue={removeFilterValue}
            withDataBreakdown
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default UserSandboxSidebar;
