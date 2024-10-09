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
  {
    question:
      'Has your organisation integrated digital technologies into its workflows?',
    widgetIndicator: 'Adoption of technology by country',
  },
  {
    question:
      'What is the size of your agriculture or forestry organisation in terms of workforce?',
    widgetIndicator: 'Organisation size',
  },
  {
    question:
      'What is the general education level/attainment of your workforce?',
    widgetIndicator: 'Education level',
  },
  {
    question:
      'What is the general level of work experience in your organisation?',
    widgetIndicator: 'Experience level',
  },
  {
    question:
      'Have your staff received training on the use of digital technologies?',
    widgetIndicator: 'Training on digital technologies',
  },
  {
    question:
      'If yes, what percentage of the workforce received this training?',
    widgetIndicator: 'Workforce training',
  },
  {
    question:
      'Have specific governance models either facilitated or hindered the adoption of digital technologies in your organization?',
    widgetIndicator: 'Governance model impact',
  },
  {
    question: 'What type of governance model do you operate under?',
    widgetIndicator: 'Governance model type',
  },
  {
    question:
      'Are there regulatory considerations influencing the governance of digital technology adoption?',
    widgetIndicator: 'Regulatory considerations',
  },
  {
    question: 'What type of digital technology has been used for agriculture?',
    widgetIndicator: 'Technology type (agriculture)',
  },
  {
    question: 'What type of digital technology has been used for forestry?',
    widgetIndicator: 'Technology type (forestry)',
  },
  {
    question:
      'Were there specific goals or challenges that prompted the adoption of digital tools?',
    widgetIndicator: 'Goals or challenges',
  },
  {
    question:
      'How would you rate the level of digitalization in your farming/forestry practices on a scale of 1 to 5 (1 being low, 5 being high)',
    widgetIndicator: 'Level of digitalization',
  },
  {
    question:
      'What are the primary functions of these technologies in the agriculture or forestry value chain?',
    widgetIndicator: 'Primary functions',
  },
  {
    question: 'What is the adoption level of these technologies?',
    widgetIndicator: 'Adoption level',
  },
  {
    question:
      'Have you encountered challenges in the adoption of digital technologies?',
    widgetIndicator: 'Challenges in the adoption',
  },
  {
    question: 'Are there specific barriers hindering further integration?',
    widgetIndicator: 'Barriers',
  },
  {
    question:
      'To what extent do digital technologies meet evolving user needs within your organization?',
    widgetIndicator: 'User needs',
  },
  {
    question: 'What are the advantages of the used technologies?',
    widgetIndicator: 'Advantages',
  },
  {
    question:
      'Have you encountered any perceived limitations or challenges in utilising these technologies?',
    widgetIndicator: 'Limitations or challenges',
  },
  {
    question: 'Do you have network connectivity?',
    widgetIndicator: 'Network connectivity',
  },
  {
    question: 'What network connectivity do you use?',
    widgetIndicator: 'Network connectivity type',
  },
  {
    question: 'How reliable is the current network connectivity?',
    widgetIndicator: 'Level of reliability',
  },
  {
    question: 'What type of devices are commonly used to access the network?',
    widgetIndicator: 'Device type',
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
