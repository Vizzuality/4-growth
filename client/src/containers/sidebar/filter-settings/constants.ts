import { DATA_SOURCE_FILTER_NAME } from "@/lib/constants";

// Order here drives the order the filters render in the sidebar.
export const SURVEY_ANALYSIS_DEFAULT_FILTERS = [
  DATA_SOURCE_FILTER_NAME,
  "location-country-region",
  "sector",
];

export const LOCKED_SECTOR_REASON =
  "Automated website analysis covers forestry organisations only, so the sector is fixed to Forestry.";

export const PROJECTIONS_DEFAULT_FILTERS = [
  "country",
  "technology-type",
  "technology",
];

export const DEFAULT_FILTERS_LABEL_MAP: Record<
  string,
  { selected: string; unSelected: string }
> = {
  [DATA_SOURCE_FILTER_NAME]: {
    selected: "Data is",
    unSelected: "Data is",
  },
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
  scenario: {
    selected: "Scenario",
    unSelected: "All scenarios",
  },
} as const;
