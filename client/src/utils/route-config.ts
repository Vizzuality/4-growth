import ROUTES from "@shared/constants/routes";

export type RouteType = "surveyAnalysis" | "projections";
export type ViewType = "explore" | "sandbox";

export const getRouteConfig = (
  pathname: string,
): { type: RouteType; view: ViewType } => {
  const isProjections = pathname.startsWith("/projections");
  const isSandbox = pathname.includes("sandbox");

  return {
    type: isProjections ? "projections" : "surveyAnalysis",
    view: isSandbox ? "sandbox" : "explore",
  };
};

export const getRouteHref = <T extends RouteType, V extends ViewType>(
  type: T,
  view: V,
): `/${(typeof ROUTES)[T][V]}` => {
  return `/${ROUTES[type][view]}` as `/${(typeof ROUTES)[T][V]}`;
};

export const getDynamicRouteHref = <T extends RouteType, V extends ViewType>(
  type: T,
  view: V,
  id: string,
): `/${(typeof ROUTES)[T][V]}/${string}` => {
  return `/${ROUTES[type][view]}/${id}` as `/${(typeof ROUTES)[T][V]}/${string}`;
};
