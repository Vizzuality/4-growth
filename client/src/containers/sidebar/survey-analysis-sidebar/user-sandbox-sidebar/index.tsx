import { FC, useCallback } from "react";

import { useAtom } from "jotai";

import { ADD_FILTER_MODE } from "@/lib/constants";
import { normalizeWidgetData } from "@/lib/normalize-widget-data";
import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { addFilterQueryParam, removeFilterQueryParamValue } from "@/lib/utils";

import { FilterQueryParam } from "@/hooks/use-filters";

import BreakdownSelector from "@/containers/sidebar/breakdown-selector";
import FilterSettings from "@/containers/sidebar/filter-settings";
import ClearFiltersButton from "@/containers/sidebar/filter-settings/clear-filters-button";
import { SURVEY_ANALYSIS_DEFAULT_FILTERS } from "@/containers/sidebar/filter-settings/constants";
import IndicatorSelector from "@/containers/sidebar/indicator-seletor";
import {
  sandboxBreakdownAtom,
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
  const [breakdown, setBreakdown] = useAtom(sandboxBreakdownAtom);
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
      select: (res) => ({
        ...res.body.data,
        data: {
          raw: res.body.data.data,
          percentages: normalizeWidgetData(res.body.data.data),
        },
      }),
    },
  );

  const addFilter = useCallback(
    (newFilter: FilterQueryParam) => {
      if (newFilter.values.length) {
        setFilters(
          addFilterQueryParam(filters, newFilter, ADD_FILTER_MODE.REPLACE),
        );
      } else if (newFilter.values.length === 0) {
        setFilters(filters.filter((filter) => filter.name !== newFilter.name));
      }
    },
    [filters, setFilters],
  );

  const removeFilterValue = useCallback(
    (name: string, valueToRemove: string) => {
      setFilters(removeFilterQueryParamValue(filters, name, valueToRemove));
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
        <div className="relative">
          <AccordionTrigger>Filters</AccordionTrigger>
          <ClearFiltersButton />
        </div>
        <AccordionContent className="py-3.5">
          <FilterSettings
            type="surveyAnalysis"
            defaultFilters={SURVEY_ANALYSIS_DEFAULT_FILTERS}
            filterQueryParams={filters}
            onAddFilter={addFilter}
            onRemoveFilterValue={removeFilterValue}
          />
          <BreakdownSelector
            breakdown={breakdown}
            setBreakdown={setBreakdown}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default UserSandboxSidebar;
