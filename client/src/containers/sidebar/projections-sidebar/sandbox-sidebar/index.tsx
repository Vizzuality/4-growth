import { FC } from "react";

import useFilters from "@/hooks/use-filters";

import FilterSettings from "@/containers/sidebar/filter-settings";
import ClearFiltersButton from "@/containers/sidebar/filter-settings/clear-filters-button";
import { PROJECTIONS_DEFAULT_FILTERS } from "@/containers/sidebar/filter-settings/constants";
import SandboxSettings from "@/containers/sidebar/projections-sidebar/sandbox-settings";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SandboxSidebar: FC = () => {
  const { filters, addFilter, removeFilterValue } = useFilters();
  return (
    <Accordion
      key="sidebar-accordion-sandbox"
      type="multiple"
      className="w-full overflow-y-auto"
      defaultValue={["settings"]}
    >
      <AccordionItem value="settings">
        <AccordionTrigger>Settings</AccordionTrigger>
        <AccordionContent className="py-3.5">
          <SandboxSettings />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="filters">
        <div className="relative">
          <AccordionTrigger>Filters</AccordionTrigger>
          <ClearFiltersButton />
        </div>
        <AccordionContent className="py-3.5">
          <FilterSettings
            type="projections"
            defaultFilters={PROJECTIONS_DEFAULT_FILTERS}
            filterQueryParams={filters}
            onAddFilter={addFilter}
            onRemoveFilterValue={removeFilterValue}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SandboxSidebar;
