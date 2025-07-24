export const DEFAULT_PROJECTIONS_SETTINGS_LABEL_MAP: Record<string, string> = {
  availableVisualizations: "Visualization",
  vertical: "Vertical",
  bubble: "Bubble",
  horizontal: "Horizontal",
  color: "Color",
  size: "Size",
} as const;

export const VISUALIZATION_TO_LABEL_MAP = {
  line_chart: "Line chart",
  area_chart: "Area chart",
  bar_chart: "Bar chart",
  bubble_chart: "Bubbles",
  table: "Table",
};

export const PROJECTION_TYPE_TO_LABEL_MAP = {
  "market-potential": "Market potential",
  "addressable-market": "Addressable market",
  penetration: "Penetration",
  shipments: "Shipments",
  "installed-base": "Installed base",
  prices: "Prices",
  revenues: "Revenues",
};

export const BUBBLE_CHART_ATTRIBUTE_TO_LABEL_MAP = {
  type: "Type",
  scenario: "Scenario",
  technology: "Technology",
  "technology-type": "Technology type",
  application: "Application",
  country: "Country",
};

export const BUBBLE_TOOLTIP_LABELS_MAP: { [key: string]: string } = {
  ...PROJECTION_TYPE_TO_LABEL_MAP,
  ...BUBBLE_CHART_ATTRIBUTE_TO_LABEL_MAP,
};
