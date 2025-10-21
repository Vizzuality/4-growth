import { ReactNode } from "react";

import { WidgetVisualizationsType } from "@shared/dto/widgets/widget-visualizations.constants";
import { atom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

import { FilterQueryParam } from "@/hooks/use-filters";

export const sandboxFiltersAtom = atom<FilterQueryParam[]>([]);
export const sandboxIndicatorAtom = atom<string | null>(null);
export const sandboxVisualizationAtom = atom<WidgetVisualizationsType | null>(
  null,
);

export function AtomsHydrator({
  filters,
  indicator,
  visualization,
  children,
}: {
  filters: FilterQueryParam[];
  indicator: string | null;
  visualization: WidgetVisualizationsType | null;
  children: ReactNode;
}) {
  useHydrateAtoms([
    [sandboxFiltersAtom, filters],
    [sandboxIndicatorAtom, indicator],
    [sandboxVisualizationAtom, visualization],
  ]);
  return children;
}
