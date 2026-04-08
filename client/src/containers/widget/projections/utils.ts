import { BreakdownProjection, CustomProjection } from "@shared/dto/projections/custom-projection.type";
import { ProjectionVisualizationsType } from "@shared/dto/projections/projection-visualizations.constants";

export const getMenuButtonText = (v: ProjectionVisualizationsType): string => {
  switch (v) {
    case "line_chart":
      return "Show as a line chart";
    case "bar_chart":
      return "Show as a bar chart";
    case "bubble_chart":
      return "Show as a bubble chart";
    case "table":
      return "Show as a table";
    default:
      return "";
  }
};

export const widgetDescriptionMap: Record<string, string> = {
  "Market Potential":
    "Maximum possible reach a product could have within its market.",
  "Addressable Market":
    "Portion of the total market potential that can realistically be addressed or reached.",
  Penetration:
    "Proportion (%) of the addressable market that has been reached.",
  Shipments: "Number of products purchased.",
  "Installed Base": "Total number of products currently in use.",
  Revenues: "Revenue generated from the product.",
  Prices: "Average price of the product. ",
};

const isRecord = (val: unknown): val is Record<string, unknown> =>
  val !== null && typeof val === "object" && !Array.isArray(val);

const isBreakdownEntry = (val: unknown): boolean =>
  isRecord(val) &&
  typeof val.label === "string" &&
  typeof val.value === "number" &&
  typeof val.total === "number";

const isBreakdownGroup = (val: unknown): boolean =>
  isRecord(val) &&
  typeof val.label === "string" &&
  Array.isArray(val.data) &&
  val.data.every(isBreakdownEntry);

export const isBreakdownProjection = (data: CustomProjection): data is BreakdownProjection =>
  Object.values(data).every(
    (units) => Array.isArray(units) && units.every(isBreakdownGroup),
  );