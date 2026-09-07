"use client";
import { FC } from "react";

import useProjectionsCategoryFilter from "@/hooks/use-category-filter";
import useScenarioFilter from "@/hooks/use-scenario-filter";

import { SCENARIOS } from "@/containers/scenarios/constants";
import ScenarioDescriptionCard from "@/containers/scenarios/descriptions/card";
import {
  SCENARIO_CARD_TITLES,
  SCENARIO_DESCRIPTIONS,
  isProjectionCategory,
} from "@/containers/scenarios/descriptions/constants";

import Title from "@/components/ui/title";

const ScenarioDescriptions: FC = () => {
  const { selectedCategories } = useProjectionsCategoryFilter();
  const { selectedScenarios, toggleScenario } = useScenarioFilter();

  const operationArea = selectedCategories[0];

  if (!isProjectionCategory(operationArea)) return null;

  const descriptions = SCENARIO_DESCRIPTIONS[operationArea];

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex flex-col gap-4 rounded-2xl bg-secondary p-6">
        <Title as="h2" size="xl" className="leading-10 tracking-[-1.2px]">
          Scenarios
        </Title>
        <p className="text-xs font-medium text-muted-foreground">
          Adjust the projection calculations by selecting different scenarios.
        </p>
      </div>
      <div
        role="radiogroup"
        aria-label="Scenarios"
        className="grid grid-cols-1 gap-0.5 md:grid-cols-2"
      >
        {SCENARIOS.map((s) => (
          <ScenarioDescriptionCard
            key={`scenario-description-${s.value}`}
            title={SCENARIO_CARD_TITLES[s.value]}
            description={descriptions[s.value]}
            icon={s.icon}
            isSelected={selectedScenarios.includes(s.value)}
            onSelect={() => toggleScenario(s.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default ScenarioDescriptions;
