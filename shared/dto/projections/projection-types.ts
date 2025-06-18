export const ProjectionScenarios = {
  BASELINE: 'baseline',
  REIMAGINING_PROGRESS: 'reimagining_progress',
  THE_FRACTURED_CONTINENT: 'the_fractured_continent',
  THE_CORPORATE_EPOCH: 'the_corporate_epoch',
};

export const PROJECTION_TYPES = {
  MARKET_POTENTIAL: 'market-potential',
  ADDRESSABLE_MARKET: 'addressable-market',
  PENETRATION: 'penetration',
  SHIPMENTS: 'shipments',
  INSTALLED_BASE: 'installed-base',
  PRICES: 'prices',
  REVENUES: 'revenues',
} as const;

export type ProjectionType =
  (typeof PROJECTION_TYPES)[keyof typeof PROJECTION_TYPES];
