import { FC } from "react";

import { useSetAtom } from "jotai/react";

import { showScenarioInfoAtom } from "@/app/(root)/projections/store";

import useScenarioFilter from "@/hooks/use-scenario-filter";

import { SCENARIOS } from "@/containers/scenarios/constants";
import ScenarioInfoCard from "@/containers/scenarios/info-card";

const ScenariosInfo: FC = () => {
  const { selectedScenarios, toggleScenario } = useScenarioFilter();
  const setShowScenarioInfo = useSetAtom(showScenarioInfoAtom);
  return (
    <div className="text-xs text-slate-500">
      <p className="mb-4">
        The projections combine foresight analysis and market modelling to
        explore potential futures up to 2040, which can be viewed under
        different scenarios.
      </p>
      <div className="space-y-2">
        {SCENARIOS.map((s) => (
          <ScenarioInfoCard
            key={`scenario-info-${s.value}`}
            title={s.label}
            icon={s.icon}
            shortDescription={s.shortDescription}
            longDescription={s.longDescription}
            isSelected={selectedScenarios.includes(s.value) || false}
            onSelect={() => {
              toggleScenario(s.value);
              setShowScenarioInfo(false);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ScenariosInfo;
