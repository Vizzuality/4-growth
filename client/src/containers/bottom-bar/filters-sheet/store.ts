import { atom } from "jotai";

import { FilterQueryParam } from "@/hooks/use-filters";

export const FilterSettingsAtom = atom<FilterQueryParam[]>([]);
export const breakdownAtom = atom<string | null>(null);
