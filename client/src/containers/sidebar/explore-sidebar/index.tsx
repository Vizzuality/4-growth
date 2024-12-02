import { FC } from "react";

import useFilters from "@/hooks/use-filters";

import FilterSettings from "@/containers/sidebar/filter-settings";
import ClearFiltersButton from "@/containers/sidebar/filter-settings/clear-filters-button";
import SectionsNav from "@/containers/sidebar/sections-nav";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ExploreSidebar: FC = () => {
  const { filters, addFilter, removeFilterValue } = useFilters();

  return (
    <Accordion
      key="sidebar-accordion-explore"
      type="multiple"
      className="w-full overflow-y-auto"
      defaultValue={["explore-sections"]}
    >
      <AccordionItem value="explore-filters">
        <div className="relative">
          <AccordionTrigger>Filters</AccordionTrigger>
          <ClearFiltersButton />
        </div>
        <AccordionContent className="py-3.5">
          <FilterSettings
            filterQueryParams={filters}
            onAddFilter={addFilter}
            onRemoveFilterValue={removeFilterValue}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="explore-sections">
        <AccordionTrigger>Sections</AccordionTrigger>
        <AccordionContent className="py-3.5" id="sidebar-sections-list">
          <SectionsNav />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ExploreSidebar;
