import * as dataForge from 'data-forge';
import * as fs from 'fs/promises';
import { CountryISO3Map } from '@shared/constants/country-iso3.map';
import { StringUtils } from '@api/utils/string.utils';
import { Logger } from '@nestjs/common';

const QUESTIONS = new Set([
  'What are the primary functions of these technologies in the agriculture or forestry value chain?',
  'What is the overall social impact of adopting digital technologies?',
  'What are the most significant costs associated with the adoption of digital technologies in your organisation',
  'Where and how do you store this data?',
  'What type of data sharing practices related to digital technology does your organisation use?',
  'Is data collected from your farming/forestry activities?',
  'Organic farming operation',
  'Have digital technologies contributed to sustainability and environmental practices?',
  'Do you use digital technologies to track and ensure adherence to sustainable farming practices and forestry activities?',
  'Approximately what percentage of overall decisions made are based on data analytics in your organisation?',
  'Unexpected or hidden costs?',
  'What type of tools or platforms do you use to collect data?',
  'Sector (agri/forestry/both)',
  'Have you observed positive impacts on resource conservation or environmental footprint?',
  'Have digital technologies contributed to energy efficiency?',
  'Have you identified organisational prerequisites (skills, workforce, education) necessary for successful technology integration?',
  'How would you rate the level of digitalization in your farming/forestry practices on a scale of 1 to 5 (1 being low, 5 being high)',
  'Do you use cloud services/data centres?',
  'What type of data do you receive or provide?',
  'Have you encountered challenges in the adoption of digital technologies?',
  'What type of digital technology has been used for agriculture?',
  'What type of digital technology has been used for forestry?',
  'What is the adoption level of these technologies?',
  'Do challenges exist in sharing and interoperability of agricultural and forestry data?',
  'What is the overall economic impact of implementing digital technologies?',
  'Are there economic implications associated with data flows in these sectors?',
  'Are there specific barriers hindering further integration?',
  'What network connectivity do you use?',
  'Were there specific goals or challenges that prompted the adoption of digital tools?',
  'What would help facilitate the expansion/upgrade of digital infrastructure in the future?',
  'Have you seen savings in inputs due to digital technologies?',
  'What type of governance model do you operate under?',
  'Have you encountered any perceived limitations or challenges in utilising these technologies?',
  'Have you observed any positive or negative effects on biodiversity in agricultural and forestry areas due to digital technology adoption?',
  'Do you use data analytics for decision-making?',
  'Are there plans to expand or upgrade your current digital infrastructure?',
  'To what extent do digital technologies meet evolving user needs within your organization?',
  'What are the advantages of the used technologies?',
  'How do these practices contribute to or impede the overall effectiveness of technology adoption?',
  'Primary area of operation in agriculture',
  'What type of devices are commonly used to access the network?',
  'How reliable is the current network connectivity? (1 being not reliable, 5 being very reliable)',
  'Do you pay for this data?',
  'How have digital technologies impacted job creation?',
  'What type of data do you collect?',
  'Do you share this data?',
  'Have specific governance models either facilitated or hindered the adoption of digital technologies in your organization?',
  'Have you experienced social benefits through the use of digital technologies?',
  'What is the level of direct costs?',
  'Agriculture/forestry organisation size',
  'Type of stakeholder',
  'Has your organisation integrated digital technologies into its workflows?',
  'Do you have network connectivity?',
  'What type of developments do you anticipate in the near future?',
  'Do data flows enhance productivity and efficiency in agriculture and forestry?',
  'Have digital technologies resulted in cost savings or increased efficiency?',
  'Primary area of operation in forestry',
  'Location (country/region)',
  'Are there regulatory considerations influencing the governance of digital technology adoption?',
]);

const EXCLUDED_QUESTIONS = new Set([
  'If you agree, please confirm the following statements  i have read the information presented in this consent form...',
  'Specific regional or subsector considerations to take into account',
  'I agree to be contacted again by the researchers for clarification or elaboration on my input in the discussion (optional)',
]);

export const transform = async () => {
  const logger = new Logger('ETL');

  const generateSurveQuestionyMap = (rows) => {
    const surveyQuestionMap = new Map();

    for (const row of rows) {
      if (!surveyQuestionMap.has(row.surveyId)) {
        surveyQuestionMap.set(row.surveyId, new Set());
      }
      surveyQuestionMap.get(row.surveyId).add(row.question);
    }

    return surveyQuestionMap;
  };

  const ensureAllSurveyQuestionsHaveAnswers = (rows) => {
    const surveyQuestionMap = generateSurveQuestionyMap(rows);

    for (const [surveyId, questions] of surveyQuestionMap) {
      if (questions.size !== QUESTIONS.size) {
        logger.log(
          `survey_id: ${surveyId} has ${questions.size} of ${QUESTIONS.size} questions answered`,
        );
      }

      const countryCode = rows.find(
        (row) => row.surveyId === surveyId,
      ).countryCode;

      for (const question of QUESTIONS) {
        if (questions.has(question) === false) {
          rows.push({
            surveyId,
            question,
            answer: 'N/A',
            countryCode,
          });
        }
      }

      // Search for questions that are not in the QUESTIONS set
      for (const question of questions) {
        if (QUESTIONS.has(question) === false) {
          console.error(
            `survey_id: ${surveyId} has an unexpected question: ${question}`,
          );
        }
      }
    }
  };

  const [answersDf, dateDf, questionDf, answerIdDf] = await Promise.all([
    dataForge.fromObject(
      JSON.parse(await fs.readFile('data/surveys/Answer.json', 'utf8')).value,
    ),
    dataForge.fromObject(
      JSON.parse(await fs.readFile('data/surveys/Survey_metadata.json', 'utf8'))
        .value,
    ),
    dataForge.fromObject(
      JSON.parse(
        await fs.readFile('data/surveys/Question_hierarchy.json', 'utf8'),
      ).value,
    ),
    dataForge.fromObject(
      JSON.parse(
        await fs.readFile('data/surveys/Categorical_Answers.json', 'utf8'),
      ).value,
    ),
  ]);

  logger.log(`Number of surveys: ${dateDf.count()}`);

  const join1 = answersDf.join(
    dateDf,
    (leftRow) => leftRow.Value['Survey_per_dayID'],
    (rightRow) => rightRow.Value['Survey_per_dayID'],
    (leftRow, rightRow) => {
      return {
        surveyId: rightRow.Value['ID'],
        answerId: leftRow.Value['ID'],
        question: leftRow.Value['Subquestion'],
        answer: leftRow.Value['Categorical_Answer'],
      };
    },
  );

  const join2 = join1.join(
    questionDf,
    (leftRow) => leftRow['question'],
    (rightRow) => rightRow.Value['ID'],
    (leftRow, rightRow) => {
      leftRow['questionId'] = leftRow['question'];
      const question = StringUtils.capitalizeFirstLetter(
        rightRow.Value['Level2'].replace(/:/g, ''),
      );
      leftRow['question'] = question;
      return leftRow;
    },
  );

  const join3 = join2.join(
    answerIdDf,
    (leftRow) => leftRow['answer'],
    (rightRow) => rightRow.Value['ID'],
    (leftRow, rightRow) => {
      leftRow['answerId'] = leftRow['answer'];
      const answer = rightRow.Value['Name'].replace(/ \([\w\s]+\)/g, '');
      leftRow['answer'] = answer;
      return leftRow;
    },
  );

  const filteredAnswers = join3.where(
    (row) => row['answer'].startsWith('No categorical answer') === false,
  );

  const answersGroupByAnswers = filteredAnswers.groupBy(
    (row) => row['surveyId'],
  );

  let skippedSurveys = 0;
  let transformedAnswers = [];
  for (const group of answersGroupByAnswers) {
    let answers = group.toArray();
    const countryAnswer = answers.find(
      (e) => e['question'] === 'Location (country/region)',
    );
    if (countryAnswer === undefined) {
      console.error(
        `survey_id: ${answers[0].surveyId} was skipped because "Location (country/region)" question has no answer (${(++skippedSurveys + '').padStart(3, '0')})`,
      );
      continue;
    }

    answers = answers.map((e) => {
      const countryCode = CountryISO3Map.getISO3ByCountryName(
        countryAnswer.answer,
      );
      if (countryCode === undefined) throw new Error('Country code not found');
      e['countryCode'] = countryCode;
      return e;
    });

    transformedAnswers.push(...answers);
  }

  transformedAnswers = transformedAnswers.filter(
    (e) => EXCLUDED_QUESTIONS.has(e.question) === false,
  );

  ensureAllSurveyQuestionsHaveAnswers(transformedAnswers);

  await fs.writeFile(
    `${__dirname}/surveys.json`,
    JSON.stringify(transformedAnswers, null, 2),
    'utf-8',
  );

  logger.log(
    `\nCreated file ${__dirname}/surveys.json and it contains data for ${answersGroupByAnswers.count() - skippedSurveys} surveys.`,
  );
};

if (require.main === module) {
  void transform();
}
