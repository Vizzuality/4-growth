import { ProjectionScenarios } from "@shared/dto/projections/projection-types";

import { PROJECTIONS_CATEGORIES } from "@/containers/sidebar/projections-sidebar/category-selector/constants";

export type ProjectionCategory =
  (typeof PROJECTIONS_CATEGORIES)[number]["value"];

export const SCENARIO_CARD_TITLES: Record<ProjectionScenarios, string> = {
  [ProjectionScenarios.BASELINE]: "Baseline",
  [ProjectionScenarios.REIMAGINING_PROGRESS]: "Reimagining Progress",
  [ProjectionScenarios.THE_FRACTURED_CONTINENT]: "Fractured Continent",
  [ProjectionScenarios.THE_CORPORATE_EPOCH]: "Corporate Epoch",
};

export const SCENARIO_DESCRIPTIONS: Record<
  ProjectionCategory,
  Record<ProjectionScenarios, string>
> = {
  Forestry: {
    [ProjectionScenarios.BASELINE]:
      "The Baseline outputs represent the projected market size of the Forestry digital technologies market based on current inputs, assumptions, and market conditions. The baseline assumes that the trends observed in historical data continue over the forecast period, with no major structural changes in the market beyond those already reflecting in the underlying forecasts.",
    [ProjectionScenarios.REIMAGINING_PROGRESS]:
      "The Reimagining Progress outputs show projections of the Forestry digital technologies market under a future scenario characterised by increased focus on environmental sustainability, digital innovation and knowledge sharing.",
    [ProjectionScenarios.THE_FRACTURED_CONTINENT]:
      "The Fractured Continent outputs show projections of the Forestry digital technologies market under a future scenario characterised by fragmentation, with strong trends of inequality, disjointed digital policies, and socio-political polarisation.",
    [ProjectionScenarios.THE_CORPORATE_EPOCH]:
      "The Corporate Epoch outputs show projections of the Forestry digital technologies market under a future scenario characterised by industrialisation, with severe climate degradation, resource scarcity, and monopolisation of digital technologies led my multi-national corporations.",
  },
  Agriculture: {
    [ProjectionScenarios.BASELINE]:
      "The Baseline outputs represent the projected market size of the Agriculture digital technologies market based on current inputs, assumptions, and market conditions. The baseline assumes that the trends observed in historical data continue over the forecast period, with no major structural changes in the market beyond those already reflecting in the underlying forecasts.",
    [ProjectionScenarios.REIMAGINING_PROGRESS]:
      "The Reimagining Progress outputs show projections of the Agriculture digital technologies market under a future scenario characterised by increased focus on environmental sustainability, digital innovation and knowledge sharing.",
    [ProjectionScenarios.THE_FRACTURED_CONTINENT]:
      "The Fractured Continent outputs show projections of the Agriculture digital technologies market under a future scenario characterised by fragmentation, with strong trends of inequality, disjointed digital policies, and socio-political polarisation.",
    [ProjectionScenarios.THE_CORPORATE_EPOCH]:
      "The Corporate Epoch outputs show projections of the Agriculture digital technologies market under a future scenario characterised by industrialisation, with severe climate degradation, resource scarcity, and monopolisation of digital technologies led my multi-national corporations.",
  },
};

export const isProjectionCategory = (
  value: string | undefined,
): value is ProjectionCategory =>
  value !== undefined && value in SCENARIO_DESCRIPTIONS;

export const isProjectionScenario = (
  value: string | undefined,
): value is ProjectionScenarios =>
  value !== undefined && value in SCENARIO_CARD_TITLES;
