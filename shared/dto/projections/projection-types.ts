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
