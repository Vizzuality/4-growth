import { FC } from "react";

import { Trash2Icon } from "lucide-react";

import useFilters from "@/hooks/use-filters";

import { Button } from "@/components/ui/button";

const ClearFiltersButton: FC = () => {
  const { filters, removeAll } = useFilters();

  if (
    filters.length === 0 ||
    filters.every((f) => f.name === "scenario" || f.name === "category")
  )
    return null;

  return (
    <Button
      type="button"
      variant="clean"
      className="absolute right-14 top-0 h-auto translate-y-1/2 gap-1 p-0 text-xs font-normal transition-colors hover:text-white/80"
      onClick={removeAll}
    >
      <span>Clear all</span>
      <Trash2Icon className="h-4 w-4" />
    </Button>
  );
};

export default ClearFiltersButton;
