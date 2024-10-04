import {
  WidgetData,
  WidgetNavigationData,
} from "@shared/dto/widgets/base-widget-data.interface";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isWidgetData = (data: any): data is WidgetData => {
  return (
    Array.isArray(data) &&
    (data.length === 0 ||
      (typeof data[0] === "object" &&
        "value" in data[0] &&
        "total" in data[0] &&
        "label" in data[0]))
  );
};

export const isWidgetNavigationData = (
  data: any,
): data is WidgetNavigationData => {
  return (
    typeof data === "object" &&
    data !== null &&
    "href" in data &&
    typeof data.href === "string"
  );
};
