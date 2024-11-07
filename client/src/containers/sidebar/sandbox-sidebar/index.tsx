import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FilterSettings from "@/containers/sidebar/filter-settings";
import IndicatorSelector from "@/containers/sidebar/indicator-seletor";
import VisualizationSelector from "@/containers/sidebar/visualization-selector";
import useWidgets from "@/hooks/use-widgets";
import { FC } from "react";

const SandboxSidebar: FC = () => {
  const { filters } = useWidgets();

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
          <VisualizationSelector />
          <IndicatorSelector />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="sandbox-filters">
        <AccordionTrigger>Filters</AccordionTrigger>
        <AccordionContent className="py-3.5">
          <FilterSettings
            filterQueryParams={filters}
            onAddFilter={() => {}}
            onRemoveFilterValue={() => {}}
            withDataBreakdown
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SandboxSidebar;
