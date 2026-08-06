import { ReactNode } from "react";

import { WidgetVisualizationsType } from "@shared/dto/widgets/widget-visualizations.constants";
import { atom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

import { FilterQueryParam, withForestryLock } from "@/hooks/use-filters";

export const sandboxFiltersAtom = atom<FilterQueryParam[]>([]);

/**
 * Saved sandboxes never pass through useFilters, so the read-time normalisation
 * that covers the URL-backed views has to be applied here too — including for
 * sandboxes persisted before the lock existed.
 */
export const lockedSandboxFiltersAtom = atom(
  (get) => withForestryLock(get(sandboxFiltersAtom)),
  (_get, set, next: FilterQueryParam[]) => set(sandboxFiltersAtom, next),
);
export const sandboxBreakdownAtom = atom<string | null>(null);
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
