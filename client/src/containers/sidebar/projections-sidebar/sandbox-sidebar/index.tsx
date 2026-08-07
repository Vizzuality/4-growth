import { FC, useState } from "react";

import { ADD_FILTER_MODE } from "@/lib/constants";

import useProjectionsCategoryFilter from "@/hooks/use-category-filter";
import useFilters from "@/hooks/use-filters";

import FilterSettings from "@/containers/sidebar/filter-settings";
import ClearFiltersButton from "@/containers/sidebar/filter-settings/clear-filters-button";
import { PROJECTIONS_DEFAULT_FILTERS } from "@/containers/sidebar/filter-settings/constants";
import ProjectionsCategorySelector from "@/containers/sidebar/projections-sidebar/category-selector";
import SandboxSettings from "@/containers/sidebar/projections-sidebar/sandbox-settings";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SandboxSidebar: FC = () => {
  const { filters, addFilter, removeFilterValue } = useFilters();
  const { selectedCategories, isCategorySelected } =
    useProjectionsCategoryFilter();
  const [openItems, setOpenItems] = useState<string[]>(
    isCategorySelected ? ["settings", "filters"] : ["categories"],
  );
  const operationArea = selectedCategories[0];

  return (
    <Accordion
      key="sidebar-accordion-sandbox"
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
      <AccordionItem value="settings">
        <AccordionTrigger disabled={!isCategorySelected}>
          Settings
        </AccordionTrigger>
        <AccordionContent className="py-3.5">
          <SandboxSettings />
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

export default SandboxSidebar;
