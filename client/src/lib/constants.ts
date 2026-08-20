export const TW_CHART_COLORS = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
  "bg-chart-6",
  "bg-chart-7",
  "bg-chart-8",
  "bg-chart-9",
  "bg-chart-10",
  "bg-chart-11",
  "bg-chart-12",
] as const;

export const CSS_CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
  "hsl(var(--chart-9))",
  "hsl(var(--chart-10))",
  "hsl(var(--chart-11))",
  "hsl(var(--chart-12))",
];

export const MAX_PIE_CHART_LABELS_COUNT = CSS_CHART_COLORS.length - 1;

export const OTHERS_LABEL = "Others";
export const OTHERS_TW_COLOR = "bg-chart-12";
export const OTHERS_CSS_COLOR = "hsl(var(--chart-12))";

export function getTwChartColor(
  identifier: string | number | undefined,
  index: number,
): string {
  return identifier === OTHERS_LABEL ? OTHERS_TW_COLOR : TW_CHART_COLORS[index];
}

export function getCssChartColor(
  identifier: string | number | undefined,
  index: number,
): string {
  return identifier === OTHERS_LABEL
    ? OTHERS_CSS_COLOR
    : CSS_CHART_COLORS[index];
}

/**
 * Catch-all answers summarise the options listed above them, so they read as a
 * closing row rather than an alphabetical peer. Order within the list is the
 * order they appear in.
 */
export const PINNED_LAST_LABELS = ["Both", "Other", OTHERS_LABEL];

/**
 * Sorts pinned labels last and leaves everything else in the order it arrived,
 * which for survey answers is the alphabetical order the API sends.
 */
export function compareAnswerLabels(a: string, b: string): number {
  const rank = (label: string) => {
    const index = PINNED_LAST_LABELS.indexOf(label);
    return index === -1 ? 0 : index + 1;
  };

  return rank(a) - rank(b);
}

export const EXTERNAL_LINKS = [
  {
    label: "Feedback",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSdmPZl2WSBP4NYwdtfMA9H97LRR7wctc_5ceASHrtgojcfjLQ/viewform",
  },
  {
    label: "Tutorials",
    href: "https://4growth-project.eu/newsroom/#deliverables",
  },
] as const;

export const ADD_FILTER_MODE = {
  MERGE: 0,
  REPLACE: 1,
} as const;

export type ADD_FILTER_MODE =
  (typeof ADD_FILTER_MODE)[keyof typeof ADD_FILTER_MODE];

// Filter name is hyphenated, the survey_answers column is data_source, the entity property is dataSource.
export { DATA_SOURCE_FILTER_NAME } from "@shared/constants/page-filters";

export const DATA_SOURCE_OPTIONS: { label: string; values: string[] }[] = [
  { label: "Survey responses", values: ["survey"] },
  { label: "Automated web data", values: ["automated"] },
  { label: "Survey and Automated", values: ["survey", "automated"] },
];

export const DEFAULT_DATA_SOURCE_VALUES = ["survey"];

export const AUTOMATED_DATA_SOURCE_VALUE = "automated";

/**
 * Automated website analysis only covers forestry organisations, so any data
 * source including it scopes results to that sector. The sidebar calls `sector`
 * "operation areas" when nothing is selected; the page filter name is `sector`.
 */
export const SECTOR_FILTER_NAME = "sector";
export const FORESTRY_SECTOR_VALUE = "Forestry";

export const CATEGORY_FILTER_NAME = "category";

/**
 * The API scopes these lists to the selected operation area, so a value picked
 * under one area may not exist under another.
 */
export const CATEGORY_SCOPED_FILTER_NAMES = ["technology", "technology-type"];

export const NA_ANSWER_LABEL = "N/A";

/**
 * Questions only an agriculture respondent can answer. Automated web analysis
 * covers forestry organisations, so these are withheld from any view including
 * it — a stray agriculture answer from a forestry respondent is a data-quality
 * artifact, not a finding, and one response would otherwise render a single bar
 * at 100%.
 */
export const AGRICULTURE_ONLY_INDICATORS = [
  "primary-area-of-operation-in-agriculture",
  "technology-type-agriculture",
];

/**
 * Comparison series order. The chart fills the first source solid and hatches the
 * rest, so it and the sidebar legend that explains it both sort by this — pinning
 * them together rather than to the order the filter values happen to arrive in.
 */
export const DATA_SOURCE_ORDER = ["survey", "automated"];

/** Legend-length names; the option labels are too long to underline inline */
export const DATA_SOURCE_SHORT_LABELS: Record<string, string> = {
  survey: "Survey",
  automated: "Automated",
};

export function compareDataSources(a: string, b: string): number {
  const rank = (source: string) => {
    const index = DATA_SOURCE_ORDER.indexOf(source);
    return index === -1 ? DATA_SOURCE_ORDER.length : index;
  };

  return rank(a) - rank(b);
}

export function getDataSourceOptionLabel(values: string[]): string | undefined {
  const key = [...values].sort().join("|");

  return DATA_SOURCE_OPTIONS.find(
    (option) => [...option.values].sort().join("|") === key,
  )?.label;
}
