import { FC } from "react";

import useFilters from "@/hooks/use-filters";

import ScenariosInfo from "@/containers/scenarios/info";
import ScenariosSelector from "@/containers/scenarios/selector";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import InfoButton from "@/components/ui/info-button";

const ExploreSidebar: FC = () => {
  const { addFilter, removeFilter } = useFilters();
  return (
    <Accordion
      key="sidebar-accordion-explore"
      type="multiple"
      className="w-full overflow-y-auto"
      defaultValue={["scenario"]}
    >
      <AccordionItem value="scenario">
        <AccordionTrigger>
          <div className="mr-1 flex w-full items-center justify-between">
            <span>Scenarios</span>
            <div className="inline-flex" onClick={(e) => e.stopPropagation()}>
              <InfoButton title="Scenario">
                <ScenariosInfo />
              </InfoButton>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="py-3.5">
          <ScenariosSelector
            onSelect={(values) => {
              if (values.length === 0) {
                removeFilter("scenario");
              } else {
                addFilter({ name: "scenario", operator: "=", values });
              }
            }}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ExploreSidebar;
