import * as dataForge from 'data-forge';
import * as fs from 'node:fs';
import { CountryISO3Map } from '@shared/constants/country-iso3.map';
import { StringUtils } from '@api/utils/string.utils';

const main = async () => {
  const [answersDf, dateDf, questionDf, answerIdDf] = await Promise.all([
    dataForge.fromObject(
      JSON.parse(await fs.promises.readFile('data/surveys/1318.json', 'utf8'))
        .Results,
    ),
    dataForge.fromObject(
      JSON.parse(await fs.promises.readFile('data/surveys/1320.json', 'utf8'))
        .Results,
    ),
    dataForge.fromObject(
      JSON.parse(await fs.promises.readFile('data/surveys/1322.json', 'utf8'))
        .Results,
    ),
    dataForge.fromObject(
      JSON.parse(await fs.promises.readFile('data/surveys/1323.json', 'utf8'))
        .Results,
    ),
  ]);

  const join1 = answersDf.join(
    dateDf,
    (leftRow) => leftRow.Value['Answer.Survey per dayID'],
    (rightRow) => rightRow.Value['Survey per day.ID'],
    (leftRow, rightRow) => {
      return {
        surveyId: rightRow.Value['SurveyID.Name'],
        answerId: leftRow.Value['Answer.ID'],
        question: leftRow.Value['Answer.Subquestion'],
        answer: leftRow.Value['Answer.Categorical answer'],
      };
    },
  );

  const join2 = join1.join(
    questionDf,
    (leftRow) => leftRow['question'],
    (rightRow) => rightRow.Value['Question hierarchy.ID'],
    (leftRow, rightRow) => {
      const question = StringUtils.capitalizeFirstLetter(
        rightRow.Value['Question hierarchy.Level2'].replace(/:/g, ''),
      );
      leftRow['question'] = question;
      return leftRow;
    },
  );

  const join3 = join2.join(
    answerIdDf,
    (leftRow) => leftRow['answer'],
    (rightRow) => rightRow.Value['Categorical answers.ID'],
    (leftRow, rightRow) => {
      leftRow['answer'] = rightRow.Value['Categorical answers.Name'];
      return leftRow;
    },
  );

  const filteredAnswers = join3.where(
    (row) => row['answer'] !== 'No categorical answer',
  );

  const answersGroupByAnswers = filteredAnswers.groupBy(
    (row) => row['surveyId'],
  );

  const transformedAnswers = [];
  for (const group of answersGroupByAnswers) {
    let answers = group.toArray();
    const countryAnswer = answers.find(
      (e) => e['question'] === 'Location (country/region)',
    );
    if (countryAnswer === undefined) {
      throw new Error('Country answer not found');
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

  fs.writeFileSync(
    `${__dirname}/surveys.json`,
    JSON.stringify(transformedAnswers, null, 2),
    'utf-8',
  );
};

void main();
