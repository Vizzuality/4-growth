import * as path from 'path';
import { transform } from './transform';

const LIKERT_TO_YES_NO_DONTKNOW = new Map([
  ['Strongly agree', 'Yes'],
  ['Agree', 'Yes'],
  ['Strongly disagree', 'Not at all'],
  ['Disagree', 'Not at all'],
  ['Neither disagree nor agree', "Don't know"],
  ['Not Applicable', "Don't know"],
]);

const WAVE2_QUESTION_NORMALIZATIONS = new Map([
  ['Agriculture/forestry organization size', 'Agriculture/forestry organisation size'],
  ['Do you share the data you have collected with others?', 'Do you share this data?'],
  ['To whom and where do you send this data', 'To whom and where do you send this data?'],
  [
    'Our organization plans to expand or upgrade its current digital infrastructure in the near future.',
    'Are there plans to expand or upgrade your current digital infrastructure?',
  ],
  [
    'Digital technologies have positively contributed to sustainability and environmental practices in our organization.',
    'Have digital technologies contributed to sustainability and environmental practices?',
  ],
  [
    'Digital technologies have resulted in cost savings or increased efficiency in our operations.',
    'Have digital technologies resulted in cost savings or increased efficiency?',
  ],
]);

const NO_TO_NOT_AT_ALL = new Map([['No', 'Not at all']]);

const WAVE2_ANSWER_NORMALIZATIONS = new Map([
  ['Are there plans to expand or upgrade your current digital infrastructure?', LIKERT_TO_YES_NO_DONTKNOW],
  ['Have digital technologies contributed to sustainability and environmental practices?', LIKERT_TO_YES_NO_DONTKNOW],
  ['Have digital technologies resulted in cost savings or increased efficiency?', LIKERT_TO_YES_NO_DONTKNOW],
  ['Would you further adopt digital technologies if you had better network connectivity?', LIKERT_TO_YES_NO_DONTKNOW],
  ['Are there specific barriers hindering further integration?', NO_TO_NOT_AT_ALL],
  ['What network connectivity do you use?', new Map([
    ['Private networks', 'Private networks (e.g. corporate or organizational networks)'],
  ])],
  ['What types of data do your products or services generate or rely on?', new Map([
    ['Geo-spatial data', 'Geospatial data'],
  ])],
  ['Do you offer any after-sales service, support, or warranty for your products or services?', new Map([
    ['No, we do not offer after-sales, service, support, or warranty', 'No, we do not offer after-sales service, support, or warranty'],
  ])],
]);

export const transformWave2 = () =>
  transform(
    'data/surveys/wave2',
    path.join(process.cwd(), 'data/surveys/surveys-wave2.json'),
    'level3',
    WAVE2_QUESTION_NORMALIZATIONS,
    WAVE2_ANSWER_NORMALIZATIONS,
  );

if (require.main === module) {
  void transformWave2();
}
