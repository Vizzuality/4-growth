export const ProjectionScenarios = {
  BASELINE: 'baseline',
  REIMAGINING_PROGRESS: 'reimagining_progress',
  THE_FRACTURED_CONTINENT: 'the_fractured_continent',
  THE_CORPORATE_EPOCH: 'the_corporate_epoch',
};

export type ProjectionScenarios =
  (typeof ProjectionScenarios)[keyof typeof ProjectionScenarios];

export const PROJECTION_TYPES = {
  ADDRESSABLE_MARKET: 'addressable-market',
  PENETRATION: 'penetration',
  SHIPMENTS: 'shipments',
  INSTALLED_BASE: 'installed-base',
  PRICES: 'prices',
  REVENUES: 'revenues',
} as const;

export type ProjectionType =
  (typeof PROJECTION_TYPES)[keyof typeof PROJECTION_TYPES];

export type ProjectionRatioConfig = {
  numerator: ProjectionType;
  denominator: ProjectionType;
  /** Multiplier applied to the ratio — 100 for percentage display, 1 otherwise. */
  multiplier: number;
  /** Unit label used as the JSON key in the returned widget data. */
  unit: string;
};

/**
 * Indicators whose displayed value is a ratio of two other indicator sums rather
 * than a direct sum/average. Add a new entry here to register future ratio types.
 *
 * NOTE: Values are embedded directly into SQL expressions. They must come from
 * this compile-time config only, never from user-controlled input.
 */
export const PROJECTION_RATIO_CONFIG: Partial<
  Record<ProjectionType, ProjectionRatioConfig>
> = {
  [PROJECTION_TYPES.PENETRATION]: {
    numerator: PROJECTION_TYPES.INSTALLED_BASE,
    denominator: PROJECTION_TYPES.ADDRESSABLE_MARKET,
    multiplier: 100,
    unit: '%',
  },
  [PROJECTION_TYPES.PRICES]: {
    numerator: PROJECTION_TYPES.REVENUES,
    denominator: PROJECTION_TYPES.SHIPMENTS,
    multiplier: 1,
    unit: 'EUR',
  },
};
