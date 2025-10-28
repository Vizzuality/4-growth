import { atom } from "jotai";

import { FilterQueryParam } from "@/hooks/use-filters";

export const FilterSettingsAtom = atom<FilterQueryParam[]>([]);
