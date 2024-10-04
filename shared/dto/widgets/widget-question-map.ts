const WIDGET_QUESTION_MAP = [
  { question: 'Location (Country/Region)', widgetIndicator: 'Total countries' },
  {
    question: 'Sector (Agri/Forestry/Both)',
    widgetIndicator: 'Organisation by sector',
  },
  {
    question: '',
    widgetIndicator: 'Total surveys',
  },
];

const getQuestionByWidgetIndicator = (
  widgetIndicator: string,
): string | undefined => {
  return WIDGET_QUESTION_MAP.find((r) => r.widgetIndicator === widgetIndicator)
    ?.question;
};

const getWidgetIndicatorByQuestion = (question: string): string | undefined => {
  return WIDGET_QUESTION_MAP.find((r) => r.question === question)
    ?.widgetIndicator;
};

export const WidgetQuestionMap = {
  getQuestionByWidgetIndicator,
  getWidgetIndicatorByQuestion,
} as const;
