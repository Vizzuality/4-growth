import {
  VALID_WIDGET_VISUALIZATIONS,
  WIDGET_VISUALIZATIONS,
  WidgetVisualizationsType,
} from "@shared/dto/widgets/widget-visualizations.constants";

import { DATA_SOURCE_FILTER_NAME } from "@/lib/constants";

export const VISUALIZATION_RESTRICTION_REASONS = {
  INDICATOR: "indicator",
  BREAKDOWN: "breakdown",
  COMPARISON: "comparison",
} as const;

export type VisualizationRestrictionReason =
  (typeof VISUALIZATION_RESTRICTION_REASONS)[keyof typeof VISUALIZATION_RESTRICTION_REASONS];

export const VISUALIZATION_RESTRICTION_COPY: Record<
  VisualizationRestrictionReason,
  string
> = {
  indicator: "Not available for the current indicator.",
  breakdown: "Not available while breaking down data.",
  comparison: "Not available while comparing data sources.",
};

export const SELECTABLE_VISUALIZATIONS = VALID_WIDGET_VISUALIZATIONS.filter(
  (v) =>
    v !== WIDGET_VISUALIZATIONS.FILTER &&
    v !== WIDGET_VISUALIZATIONS.NAVIGATION &&
    v !== WIDGET_VISUALIZATIONS.SINGLE_VALUE,
);

export const hasMultipleDataSources = (
  filters: { name: string; values: string[] }[],
) =>
  (filters.find((filter) => filter.name === DATA_SOURCE_FILTER_NAME)?.values
    .length ?? 0) > 1;

export interface DisabledVisualization {
  visualization: WidgetVisualizationsType;
  reason: VisualizationRestrictionReason;
}

interface VisualizationAvailabilityParams {
  candidates: readonly WidgetVisualizationsType[];
  visualisations: readonly WidgetVisualizationsType[] | undefined;
  selectedVisualization: WidgetVisualizationsType | null;
  breakdown?: string | null;
  hasMultipleSources?: boolean;
}

/**
 * Breaking down data and comparing data sources both force bar rendering, so any
 * other type offered alongside them would do nothing when picked. The user's
 * choice is never rewritten — only `effectiveVisualization` reflects the
 * restriction, so dropping it restores whatever they had picked.
 */
export function getVisualizationAvailability({
  candidates,
  visualisations,
  selectedVisualization,
  breakdown,
  hasMultipleSources = false,
}: VisualizationAvailabilityParams): {
  effectiveVisualization: WidgetVisualizationsType | null;
  disabled: DisabledVisualization[];
} {
  const restriction = breakdown
    ? VISUALIZATION_RESTRICTION_REASONS.BREAKDOWN
    : hasMultipleSources
      ? VISUALIZATION_RESTRICTION_REASONS.COMPARISON
      : null;

  const disabled = candidates.flatMap<DisabledVisualization>(
    (visualization) => {
      // Unsupported by the indicator outranks the rest: it is the one reason
      // dropping the breakdown or the extra source will not resolve.
      if (!visualisations?.includes(visualization)) {
        return [
          {
            visualization,
            reason: VISUALIZATION_RESTRICTION_REASONS.INDICATOR,
          },
        ];
      }

      if (
        restriction &&
        visualization !== WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART
      ) {
        return [{ visualization, reason: restriction }];
      }

      return [];
    },
  );

  return {
    effectiveVisualization: restriction
      ? WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART
      : selectedVisualization,
    disabled,
  };
}
