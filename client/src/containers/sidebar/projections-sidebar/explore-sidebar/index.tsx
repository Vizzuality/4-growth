import { FC, useState } from "react";

import { useSetAtom } from "jotai";

import { ADD_FILTER_MODE } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { showScenarioInfoAtom } from "@/app/(root)/projections/store";

import useProjectionsCategoryFilter from "@/hooks/use-category-filter";
import useFilters from "@/hooks/use-filters";
import useScenarioFilter from "@/hooks/use-scenario-filter";

import ScenariosInfo from "@/containers/scenarios/info";
import ScenarioInfoButton from "@/containers/scenarios/info-button";
import {
  SCENARIO_CARD_TITLES,
  isProjectionScenario,
} from "@/containers/scenarios/descriptions/constants";
import ScenariosSelector from "@/containers/scenarios/selector";
import FilterSettings from "@/containers/sidebar/filter-settings";
import ClearFiltersButton from "@/containers/sidebar/filter-settings/clear-filters-button";
import { PROJECTIONS_DEFAULT_FILTERS } from "@/containers/sidebar/filter-settings/constants";
import ProjectionsCategorySelector from "@/containers/sidebar/projections-sidebar/category-selector";

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
  const { selectedScenarios } = useScenarioFilter();
  const { selectedCategories, isCategorySelected } =
    useProjectionsCategoryFilter();
  const operationArea = selectedCategories[0];
  const activeScenario = isProjectionScenario(selectedScenarios[0])
    ? SCENARIO_CARD_TITLES[selectedScenarios[0]]
    : undefined;

  const [openItems, setOpenItems] = useState<string[]>(
    isCategorySelected ? ["categories", "filters"] : ["categories"],
  );
  const isScenarioOpen = openItems.includes("scenario");

  return (
    <Accordion
      key="sidebar-accordion-explore"
      type="multiple"
      className="w-full overflow-y-auto"
      value={openItems}
      onValueChange={setOpenItems}
    >
      <AccordionItem value="categories">
        <AccordionTrigger>
          <span className="mr-4 flex w-full items-center justify-between">
            <span>Operation area</span>
            {isCategorySelected && (
              <span className="text-xs font-normal">{operationArea}</span>
            )}
          </span>
        </AccordionTrigger>
        <AccordionContent className="py-3.5">
          <ProjectionsCategorySelector
            onSelect={() =>
              setOpenItems((prev) => prev.filter((v) => v !== "categories"))
            }
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="scenario">
        <AccordionTrigger disabled={!isCategorySelected}>
          <div
            className={cn("flex w-full items-center justify-between", {
              "mr-2": !isScenarioOpen,
              "mr-1": isScenarioOpen,
            })}
          >
            <span>Scenarios</span>
            {isScenarioOpen ? (
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
            ) : (
              activeScenario && (
                <span className="text-xs font-normal">{activeScenario}</span>
              )
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="py-3.5">
          <ScenariosSelector />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="filters">
        <div className="relative">
          <AccordionTrigger disabled={!isCategorySelected}>
            Filters
          </AccordionTrigger>
          <ClearFiltersButton />
        </div>
        <AccordionContent className="py-3.5">
          <FilterSettings
            type="projections"
            defaultFilters={PROJECTIONS_DEFAULT_FILTERS}
            filterQueryParams={filters}
            onAddFilter={(newFilter) =>
              addFilter(newFilter, ADD_FILTER_MODE.REPLACE)
            }
            onRemoveFilterValue={removeFilterValue}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ExploreSidebar;
