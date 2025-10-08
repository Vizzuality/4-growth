import { FC } from "react";

import { ADD_FILTER_MODE } from "@/lib/constants";

import useFilters from "@/hooks/use-filters";
import useSandboxWidget from "@/hooks/use-sandbox-widget";

import FilterSettings from "@/containers/sidebar/filter-settings";
import ClearFiltersButton from "@/containers/sidebar/filter-settings/clear-filters-button";
import { SURVEY_ANALYSIS_DEFAULT_FILTERS } from "@/containers/sidebar/filter-settings/constants";
import IndicatorSelector from "@/containers/sidebar/indicator-seletor";
import VisualizationSelector from "@/containers/sidebar/visualization-selector";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SandboxSidebar: FC = () => {
  const { filters, addFilter, removeFilterValue } = useFilters();
  const {
    indicator,
    visualization,
    getWidgetQuery: { data: widget },
    setIndicator,
    setVisualization,
  } = useSandboxWidget();

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
            widget={widget}
            onVisualizationSelected={setVisualization}
          />
          <IndicatorSelector
            widget={widget}
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
            onAddFilter={(newFilter) =>
              addFilter(newFilter, ADD_FILTER_MODE.REPLACE)
            }
            onRemoveFilterValue={removeFilterValue}
            withDataBreakdown
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SandboxSidebar;
