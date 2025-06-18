import { FC } from "react";

import { useSetAtom } from "jotai";

import { showScenarioInfoAtom } from "@/app/(root)/projections/store";

import useFilters from "@/hooks/use-filters";

import ScenariosInfo from "@/containers/scenarios/info";
import ScenarioInfoButton from "@/containers/scenarios/info-button";
import ScenariosSelector from "@/containers/scenarios/selector";
import FilterSettings from "@/containers/sidebar/filter-settings";
import ClearFiltersButton from "@/containers/sidebar/filter-settings/clear-filters-button";
import { PROJECTIONS_DEFAULT_FILTERS } from "@/containers/sidebar/filter-settings/constants";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const ExploreSidebar: FC = () => {
  const setShowScenarioInfo = useSetAtom(showScenarioInfoAtom);
  const { filters, addFilter, removeFilterValue } = useFilters();

  return (
    <Accordion
      key="sidebar-accordion-explore"
      type="multiple"
      className="w-full overflow-y-auto"
      defaultValue={["scenario", "filters"]}
    >
      <AccordionItem value="scenario">
        <AccordionTrigger>
          <div className="mr-1 flex w-full items-center justify-between">
            <span>Scenarios</span>
            <div className="inline-flex" onClick={(e) => e.stopPropagation()}>
              <ScenarioInfoButton>
                <ScenariosInfo />
                <Button
                  className="ml-6 mt-4"
                  onClick={() => setShowScenarioInfo(false)}
                >
                  Close
                </Button>
              </ScenarioInfoButton>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="py-3.5">
          <ScenariosSelector />
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

export default ExploreSidebar;
