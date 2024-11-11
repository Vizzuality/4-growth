import { BaseWidgetWithData } from "@shared/dto/widgets/base-widget-data.interface";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSidebarLinkId = (slug?: string): string =>
  `sidebar-${slug}-link`;
export const getInPageLinkId = (slug?: string): string => `inPage-${slug}-link`;

export function isEmptyWidget(data: BaseWidgetWithData["data"]): boolean {
  return (
    !data.counter &&
    !data.breakdown &&
    !data.navigation &&
    !data.chart?.length &&
    !data.map?.length
  );
}
