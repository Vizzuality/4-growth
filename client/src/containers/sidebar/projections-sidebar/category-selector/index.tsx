import { FC } from "react";

import { cn } from "@/lib/utils";

import useProjectionsCategoryFilter from "@/hooks/use-category-filter";

import { PROJECTIONS_CATEGORIES } from "@/containers/sidebar/projections-sidebar/category-selector/constants";

const ProjectionsCategorySelector: FC<{
  onSelect: (category: string) => void;
}> = ({ onSelect }) => {
  const { selectedCategories, toggleCategory } = useProjectionsCategoryFilter();

  return (
    <div className="grid grid-cols-1 gap-0.5 md:grid-cols-2">
      {PROJECTIONS_CATEGORIES.map(({ label, value, icon }) => (
        <label
          key={`category-selector-${value}`}
          className={cn({
            "group relative flex cursor-pointer select-none flex-row items-center gap-4 rounded-2xl p-4 transition-colors md:flex-col md:items-start":
              true,
            "bg-secondary": selectedCategories.includes(value),
          })}
        >
          <input
            type="checkbox"
            className="sr-only"
            checked={selectedCategories.includes(value)}
            onChange={() => {
              toggleCategory(value);
              onSelect(value);
            }}
          />
          <div
            className={cn(
              "rounded-full bg-secondary p-2 text-white transition-colors",
              {
                "bg-white text-secondary": selectedCategories.includes(value),
                "group-hover:bg-magenta-500":
                  !selectedCategories.includes(value),
              },
            )}
          >
            {icon}
          </div>
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
};

export default ProjectionsCategorySelector;
