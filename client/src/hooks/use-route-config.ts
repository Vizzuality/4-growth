"use client";
import { usePathname } from "next/navigation";

import { getRouteConfig, RouteType, ViewType } from "@/utils/route-config";

export default function useRouteConfig(): {
  type: RouteType;
  view: ViewType;
  pathname: string;
} {
  const pathname = usePathname();
  return { pathname, ...getRouteConfig(pathname) };
}
