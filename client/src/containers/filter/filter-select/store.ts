import { ReactNode } from "react";

import { PageFilter } from "@shared/dto/widgets/page-filter.entity";
import { atom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

export enum FilterSelectStep {
  name = "name",
  values = "values",
  valuesOperator = "valuesOperator",
  valuesList = "valuesList",
}

export const currentStepAtom = atom<FilterSelectStep>(FilterSelectStep.name);
export const currentFilterAtom = atom<PageFilter | null>(null);
export function AtomsHydrator({
  filter,
  currentStep,
  children,
}: {
  currentStep: FilterSelectStep;
  filter: PageFilter | null;
  children: ReactNode;
}) {
  useHydrateAtoms([
    [currentStepAtom, currentStep],
    [currentFilterAtom, filter],
  ]);
  return children;
}
