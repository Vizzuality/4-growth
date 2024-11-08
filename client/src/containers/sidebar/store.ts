import { WidgetVisualizationsType } from "@shared/dto/widgets/widget-visualizations.constants";
import { atom } from "jotai";

import { FilterQueryParam } from "@/hooks/use-filters";

// export const customWidgetIdAtom = atom<string | null>(null);
export const sandboxFiltersAtom = atom<FilterQueryParam[]>([]);
export const sandboxIndicatorAtom = atom<string | null>(null);
export const sandboxVisualizationAtom = atom<WidgetVisualizationsType | null>(
  null,
);
