import {
  BaseWidgetWithData,
  WidgetData,
} from "@shared/dto/widgets/base-widget-data.interface";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEmptyWidget(data: BaseWidgetWithData["data"]): boolean {
  return Object.keys(data).length === 0;
}

export function normalizeWidgetData(widgetData: WidgetData): WidgetData {
  const result = { ...widgetData };

  if (result.map) {
    const totalCount = result.map.reduce((sum, entry) => sum + entry.value, 0);
    result.map = result.map.map((entry) => ({
      ...entry,
      value: Math.round((entry.value / totalCount) * 100),
    }));
  }

  if (result.chart) {
    result.chart = result.chart.map((entry) => ({
      ...entry,
      value: Math.round((entry.value / entry.total) * 100),
    }));
  }

  return result;
}
