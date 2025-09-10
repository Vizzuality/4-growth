export const SURVEY_ANALYSIS_DEFAULT_FILTERS = [
  "location-country-region",
  "sector",
];

export const PROJECTIONS_DEFAULT_FILTERS = [
  "country",
  "technology-type",
  "technology",
  "application",
];

export const DEFAULT_FILTERS_LABEL_MAP: Record<
  string,
  { selected: string; unSelected: string }
> = {
  country: {
    selected: "Country",
    unSelected: "All countries",
  },

  "technology-type": {
    selected: "Technology type",
    unSelected: "All technology types",
  },
  technology: {
    selected: "Technology",
    unSelected: "All technologies",
  },
  application: {
    selected: "Application",
    unSelected: "All applications",
  },
  "location-country-region": {
    selected: "Country",
    unSelected: "All countries",
  },
  sector: {
    selected: "Sector",
    unSelected: "All operation areas",
  },
  type: {
    selected: "Type",
    unSelected: "All types",
  },
} as const;
