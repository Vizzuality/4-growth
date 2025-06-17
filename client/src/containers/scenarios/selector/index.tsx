import { FC, useState } from "react";

import { cn } from "@/lib/utils";

import { SCENARIOS } from "@/containers/scenarios/constants";

const ScenariosSelector: FC<{
  onSelect: (scenarios: string[]) => void;
}> = ({ onSelect }) => {
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);

  const handleScenarioChange = (value: string) => {
    const newValues = selectedScenarios.includes(value)
      ? selectedScenarios.filter((v) => v !== value)
      : [...selectedScenarios, value];

    setSelectedScenarios(newValues);
    onSelect(newValues);
  };

  return (
    <div className="grid grid-cols-2 gap-0.5">
      {SCENARIOS.map((s) => (
        <label
          key={`scenario-selector-${s.value}`}
          className={cn({
            "group relative flex cursor-pointer select-none flex-col items-start gap-4 rounded-2xl p-4 transition-colors":
              true,
            "bg-secondary": selectedScenarios.includes(s.value),
          })}
        >
          <input
            type="checkbox"
            className="sr-only"
            checked={selectedScenarios.includes(s.value)}
            onChange={() => handleScenarioChange(s.value)}
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
