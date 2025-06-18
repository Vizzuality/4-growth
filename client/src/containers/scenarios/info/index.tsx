import { FC } from "react";

import useScenarioFilter from "@/hooks/use-scenario-filter";

import { SCENARIOS } from "@/containers/scenarios/constants";
import ScenarioInfoCard from "@/containers/scenarios/info-card";

const ScenariosInfo: FC = () => {
  const { selectedScenarios, toggleScenario } = useScenarioFilter();
  return (
    <div className="text-xs text-slate-500">
      <p className="mb-4 px-4">
        Lorem ipsum dolor sit amet consectetur. Enim laoreet volutpat lobortis
        ultrices mattis amet gravida augue dapibus. Mattis risus at nisi at ut
        gravida non maecenas. Pulvinar maecenas leo felis eu eget eget ac lorem
        sed. Cras morbi tellus vitae quisque quis.
      </p>
      <div className="space-y-2">
        {SCENARIOS.map((s) => (
          <ScenarioInfoCard
            key={`scenario-info-${s.value}`}
            title={s.label}
            shortDescription={s.shortDescription}
            longDescription={s.longDescription}
            isSelected={selectedScenarios.includes(s.value) || false}
            onSelect={() => toggleScenario(s.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default ScenariosInfo;
