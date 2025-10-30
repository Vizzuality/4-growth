"use client";
import { FC } from "react";

import { cn } from "@/lib/utils";

import useScenarioFilter from "@/hooks/use-scenario-filter";

import { SCENARIOS } from "@/containers/scenarios/constants";

const ScenariosSelector: FC<{ onToggleScenario?: () => void }> = ({
  onToggleScenario,
}) => {
  const { selectedScenarios, toggleScenario } = useScenarioFilter();

  return (
    <div className="grid grid-cols-1 gap-0.5 md:grid-cols-2">
      {SCENARIOS.map((s) => (
        <label
          key={`scenario-selector-${s.value}`}
          className={cn({
            "group relative flex cursor-pointer select-none flex-row items-center gap-4 rounded-2xl p-4 transition-colors md:flex-col md:items-start":
              true,
            "bg-secondary": selectedScenarios.includes(s.value),
          })}
        >
          <input
            type="checkbox"
            className="sr-only"
            checked={selectedScenarios.includes(s.value)}
            onChange={() => {
              toggleScenario(s.value);

              if (onToggleScenario) onToggleScenario();
            }}
          />
          <div
            className={cn(
              "rounded-full bg-secondary p-2 text-white transition-colors",
              {
                "bg-white text-secondary": selectedScenarios.includes(s.value),
                "group-hover:bg-magenta-500": !selectedScenarios.includes(
                  s.value,
                ),
              },
            )}
          >
            {s.icon}
          </div>
          <span>{s.label}</span>
        </label>
      ))}
    </div>
  );
};

export default ScenariosSelector;
