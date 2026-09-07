import { FC, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ScenarioDescriptionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  isSelected: boolean;
  onSelect: () => void;
}

const ScenarioDescriptionCard: FC<ScenarioDescriptionCardProps> = ({
  title,
  description,
  icon,
  isSelected,
  onSelect,
}) => (
  <label
    className={cn({
      "group flex h-full cursor-pointer select-none flex-col gap-4 rounded-2xl border-2 border-transparent p-6 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-magenta-500": true,
      "bg-navy-900 hover:border-magenta-500": !isSelected,
      "bg-muted": isSelected,
    })}
  >
    <input
      type="radio"
      name="projection-scenario"
      className="sr-only"
      checked={isSelected}
      onChange={onSelect}
    />
    <div
      className={cn(
        "self-start rounded-full bg-secondary p-2 text-white transition-colors",
        { "group-hover:bg-magenta-500": !isSelected },
      )}
    >
      {icon}
    </div>
    <div className="flex flex-col gap-4">
      <span
        className={cn({
          "text-base font-semibold tracking-[-0.48px]": true,
          "text-foreground": !isSelected,
          "text-navy-950": isSelected,
        })}
      >
        {title}
      </span>
      <p
        className={cn({
          "text-xs font-medium": true,
          "text-foreground": !isSelected,
          "text-slate-500": isSelected,
        })}
      >
        {description}
      </p>
    </div>
  </label>
);

export default ScenarioDescriptionCard;
