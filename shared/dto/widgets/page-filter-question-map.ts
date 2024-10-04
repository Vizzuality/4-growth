const PAGE_FILTER_QUESTION_MAP = {
  'eu-member-state': ['Location (Country/Region)'],
  sector: ['Sector (Agri/Forestry/Both)'],
} as const;

export type PageFilterQuestionKey = keyof typeof PAGE_FILTER_QUESTION_MAP;
export type PageFilterQuestionType =
  (typeof PAGE_FILTER_QUESTION_MAP)[keyof typeof PAGE_FILTER_QUESTION_MAP];

export const AVAILABLE_PAGE_FILTER_NAMES = Object.keys(
  PAGE_FILTER_QUESTION_MAP,
);

const getColumnValueByFilterName = (filterName: PageFilterQuestionKey) => {
  return PAGE_FILTER_QUESTION_MAP[filterName];
};

export const PageFilterQuestionMap = {
  getColumnValueByFilterName,
} as const;
