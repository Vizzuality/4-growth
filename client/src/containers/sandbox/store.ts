import { BaseWidgetWithData } from "@shared/dto/widgets/base-widget-data.interface";
import { WidgetVisualizationsType } from "@shared/dto/widgets/widget-visualizations.constants";
import { atom } from "jotai";

export const customWidgetAtom = atom<BaseWidgetWithData | null>(null);
export const selectedVisualizationAtom = atom<WidgetVisualizationsType | null>(
  null,
);
