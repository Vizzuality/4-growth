import { FC, useCallback } from "react";

import { useAtom } from "jotai";

import { normalizeWidgetData } from "@/lib/normalize-widget-data";
import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { addFilterQueryParam, removeFilterQueryParamValue } from "@/lib/utils";

import { FilterQueryParam } from "@/hooks/use-filters";

import FilterSettings from "@/containers/sidebar/filter-settings";
import ClearFiltersButton from "@/containers/sidebar/filter-settings/clear-filters-button";
import { SURVEY_ANALYSIS_DEFAULT_FILTERS } from "@/containers/sidebar/filter-settings/constants";
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
      setFilters(addFilterQueryParam(filters, newFilter));
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
            withDataBreakdown
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default UserSandboxSidebar;
