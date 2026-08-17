import * as dataForge from 'data-forge';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CountryISOMap } from '@shared/constants/country-iso.map';
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
  // 'Have specific governance models either facilitated or hindered the adoption of digital technologies in your organization?',
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
  // Wave 2/3 questions
  'Can you provide insights into the cost structure associated with implementing and maintaining your technology?',
  'Do you conduct market research or needs assessments before developing digital solutions for agriculture and forestry?',
  'Do you employ specific strategies to penetrate diverse markets within agriculture and forestry?',
  'Do you offer any after-sales service, support, or warranty for your products or services?',
  'Do you prioritize user needs within the agricultural and forestry sectors during the development phase?',
  'To whom and where do you send this data?',
  'What is the geographical reach of the services that you offer?',
  'What percentage of your products or services are specifically targeted at the agricultural and forestry sectors?',
  'What sales model do you primarily use for your products/services?',
  'What type of organisation are you?',
  'What type of users do you primarily provide your technology to?',
  'What types of data do your products or services generate or rely on?',
  'Would you be able to operate without this data?',
  'Would you further adopt digital technologies if you had better network connectivity?',
]);

const WAVE3_QUESTION_NORMALIZATIONS = new Map([
  [
    'Digital technologies have positively contributed to sustainability and environmental practices in our organization.',
    'Have digital technologies contributed to sustainability and environmental practices?',
  ],
  [
    'Digital technologies have resulted in cost savings or increased efficiency in our operations.',
    'Have digital technologies resulted in cost savings or increased efficiency?',
  ],
  [
    'To whom and where do you send derived information or data?',
    'To whom and where do you send this data?',
  ],
]);

const EXCLUDED_QUESTIONS = new Set([
  'If you agree, please confirm the following statements  i have read the information presented in this consent form...',
  'Specific regional or subsector considerations to take into account',
  'I agree to be contacted again by the researchers for clarification or elaboration on my input in the discussion (optional)',
]);

const LIKERT_TO_YES_NO_DONTKNOW = new Map([
  ['Strongly agree', 'Yes'],
  ['Agree', 'Yes'],
  ['Strongly disagree', 'Not at all'],
  ['Disagree', 'Not at all'],
  ['Neither disagree nor agree', "Don't know"],
  ['Negligible impact', 'Not at all'],
]);

const DATA_TYPES_SHORT_TO_LONG = new Map([
  ['Crop and yield data', 'Crop and Yield Data (e.g., production quantities, quality metrics)'],
  ['Financial and operational data', 'Financial and Operational Data (e.g., expenses, profits, workflow efficiency)'],
  ['Inventory and equipment data', 'Inventory and Equipment Data (e.g., machinery status, stock levels)'],
  ['Livestock data', 'Livestock Data (e.g., health, productivity, breeding)'],
  ['Market and economic data', 'Market and Economic Data (e.g., prices, demand trends, cost analysis)'],
  ['Pest and disease data', 'Pest and Disease Data (e.g., infestations, outbreaks, treatments)'],
  ['Remote sensing and geospatial data', 'Remote Sensing and Geospatial Data (e.g., satellite imagery, GIS mapping)'],
  ['Soil data', 'Soil Data (e.g., pH levels, nutrient content, moisture)'],
  ['Weather and environmental data', 'Weather and Environmental Data (e.g., temperature, precipitation, air quality)'],
]);

const TECH_FUNCTIONS_SHORT_TO_LONG = new Map([
  ['Crop health and disease detection', 'Crop/Forest Health and disease detection (e.g. early detection via sensors or drones)'],
  ['Data management', 'Data collection and Management (e.g. data storage, analytics, dashboards)'],
  ['Decision-making', 'Decision-making Support (e.g. AI/ML models for recommendations)'],
  ['Harvesting and distribution', 'Harvesting and distribution (e.g. automated machinery, tranportation tracking)'],
  ['Monitoring', 'Monitoring and surveillance (e.g. crop/forest health, pest detection, environmental conditions)'],
  ['Planning and Management', 'Planning and Management (e.g. Resource allocation, inventory management)'],
  ['Production phase', 'Production phase enhancement (e.g. optimizing yields, resource efficiency)'],
  ['Supply chain optimisation', 'Supply chain optimisation (e.g. logistics, traceability, post-harvest handling)'],
]);

const FARM_MGMT_SOFTWARE = 'Farm and Forest Management Software (e.g., FMIS, forest management system)';
const TOOLS_SHORT_TO_LONG = new Map([
  ['Farm Management Software', FARM_MGMT_SOFTWARE],
  ['Farm Management Software (e.g., digital tools for holistic practical, operational or financial management of a farm etc.)', FARM_MGMT_SOFTWARE],
  ['Forest Management Software', FARM_MGMT_SOFTWARE],
  ['Field Data Collection Apps', 'Field Data Collection Tools (e.g., mobile apps, handheld devices)'],
  ['IoT Devices', 'IoT Devices and Sensors (e.g., soil moisture sensors, weather stations, livestock trackers)'],
  ['Precision Agriculture Technology', 'Precision Agriculture and Forestry Technology (e.g., variable rate technology, GPS-guided equipment)'],
  ['Remote sensing platforms', 'Remote Sensing Platforms (e.g., drones, satellites)'],
  ['Research Databases', 'Research Data platforms (e.g., academic databases)'],
  ['Traceability systems', 'Traceability and Supply Chain Systems (e.g., blockchain for tracking produce, timber certification systems)'],
]);

const NETWORK_CONNECTIVITY_NORMALIZATIONS = new Map([
  ['Cellular networks', 'Cellular networks (e.g. 3G, 4G, 5G)'],
  ['What network connectivity do you use? - Cullular networks (e.g. 3G, 4G, 5G)', 'Cellular networks (e.g. 3G, 4G, 5G)'],
  ['IoT networks', 'IoT specific Networks (e.g. LPWAN, LoRaWan, Zigbee)'],
  ['Low-power Wide-area network', 'IoT specific Networks (e.g. LPWAN, LoRaWan, Zigbee)'],
  ['Private networks', 'Private networks (e.g. corporate or organizational networks)'],
  ['Sattelite internet', 'Satellite internet'],
  ['Wired internet', 'Wired internet (e.g. DSL, Ethernet)'],
  ['Wireless internet', 'Wireless internet (Wi-Fi)'],
]);

const STAKEHOLDER_NORMALIZATIONS = new Map([
  ['Farmer/agricultural producers', 'Producer (Farmer/Forest Owner/Forester)'],
  ['Forest owner', 'Producer (Farmer/Forest Owner/Forester)'],
  ['Forester', 'Producer (Farmer/Forest Owner/Forester)'],
  ['Forest operator', 'Producer (Farmer/Forest Owner/Forester)'],
  ['Research institutes and research networks', 'Research/Academic organisation'],
  ['Digital technology provider', 'Data/Technology/Service Provider'],
  ['Service/information provider', 'Data/Technology/Service Provider'],
  ['Infrastructure provider', 'Data/Technology/Service Provider'],
  ['Forest product processor', 'Processor (Forest/Agricultural products)'],
  ['Farming cooperative', 'Cooperative/Association'],
  ['Farming association', 'Cooperative/Association'],
  ['Forestry association', 'Cooperative/Association'],
  ['Network organisation (National/European)', 'Network organisation'],
]);

const DIGITAL_TECH_AGRICULTURE_NORMALIZATIONS = new Map([
  ['Automated machinery and robotics', 'Robotic Systems or Smart Machines (e.g., drones or harvesting/weeding/planting/milking robots etc.)'],
  ['Automated machinery and robotics 1', 'Robotic Systems or Smart Machines (e.g., drones or harvesting/weeding/planting/milking robots etc.)'],
  ['Farm Management Information Systems', 'Farm Management Software (e.g., digital tools for holistic practical, operational or financial management of a farm etc.)'],
  ['Monitoring and tracking of livestock/crops', 'Recording and Mapping Technologies (e.g., mapping or sensor-based monitoring of crops/soil/animals/weather conditions etc.)'],
  ['Smart irrigation systems', 'Map or Sensor-based Variable Rate Technologies (e.g., advice or automatic variable application of fertilizers, persiticides, or irrigation etc.)'],
]);

const DIGITAL_TECH_FORESTRY_NORMALIZATIONS = new Map([
  ['Drones for Forest Monitoring', 'Field Survey Technologies (e.g., drones, ground sensors for soil/weather/fire prediction, GPS devices, Geographic Information Systems Software etc.)'],
  ['Forest Fire Prediction and Monitoring systems', 'Field Survey Technologies (e.g., drones, ground sensors for soil/weather/fire prediction, GPS devices, Geographic Information Systems Software etc.)'],
]);

const WAVE1_ANSWER_NORMALIZATIONS = new Map([
  ['Are there plans to expand or upgrade your current digital infrastructure?', LIKERT_TO_YES_NO_DONTKNOW],
  ['Would you further adopt digital technologies if you had better network connectivity?', LIKERT_TO_YES_NO_DONTKNOW],
  ['Have digital technologies contributed to sustainability and environmental practices?', LIKERT_TO_YES_NO_DONTKNOW],
  ['Have digital technologies resulted in cost savings or increased efficiency?', LIKERT_TO_YES_NO_DONTKNOW],
  ['What type of data do you collect?', DATA_TYPES_SHORT_TO_LONG],
  ['What are the primary functions of these technologies in the agriculture or forestry value chain?', TECH_FUNCTIONS_SHORT_TO_LONG],
  ['What type of tools or platforms do you use to collect data?', TOOLS_SHORT_TO_LONG],
  ['What network connectivity do you use?', NETWORK_CONNECTIVITY_NORMALIZATIONS],
  ['Type of stakeholder', STAKEHOLDER_NORMALIZATIONS],
  ['What type of digital technology has been used for agriculture?', DIGITAL_TECH_AGRICULTURE_NORMALIZATIONS],
  ['What type of digital technology has been used for forestry?', DIGITAL_TECH_FORESTRY_NORMALIZATIONS],
  ['Primary area of operation in agriculture', new Map([
    ['Crop cultivation - grains', 'Arable farming (grains, vegetables, legumes, fruits, plant propagation, etc.)'],
    ['Crop cultivation - fruits', 'Arable farming (grains, vegetables, legumes, fruits, plant propagation, etc.)'],
    ['Crop cultivation - legumes', 'Arable farming (grains, vegetables, legumes, fruits, plant propagation, etc.)'],
    ['Crop cultivation - vegetables', 'Arable farming (grains, vegetables, legumes, fruits, plant propagation, etc.)'],
    ['Crop cultivation - horticulture', 'Arable farming (grains, vegetables, legumes, fruits, plant propagation, etc.)'],
    ['Plant propagation', 'Arable farming (grains, vegetables, legumes, fruits, plant propagation, etc.)'],
    ['Livestock farming - dairy', 'Livestock farming (meat, dairy, other)'],
    ['Livestock farming - meat', 'Livestock farming (meat, dairy, other)'],
    ['Livestock farming - other', 'Livestock farming (meat, dairy, other)'],
    ['Farm management services', 'Service and support (farm management services, crop services, post-harvesting handling services, etc.)'],
    ['Agricultural machinery and equipment services', 'Service and support (farm management services, crop services, post-harvesting handling services, etc.)'],
    ['Post-harvest handling services', 'Service and support (farm management services, crop services, post-harvesting handling services, etc.)'],
    ['Crop services', 'Service and support (farm management services, crop services, post-harvesting handling services, etc.)'],
    ['Other namely 1', 'Other namely'],
  ])],
  ['What type of organisation are you?', new Map([
    ['Small to Medium Entreprise', 'SME'],
  ])],
  ['Agriculture/forestry organisation size', new Map([
    ['Micro (1-9 employees)', 'Small-scale/Local'],
    ['Small (10-49 employees)', 'Small-scale/Local'],
    ['Medium (50-249 employees)', 'Medium-scale/Local-National'],
    ['Large (250+ employees)', 'Large-scale/National-International'],
  ])],
  ['Would you be able to operate without this data?', new Map([
    ['Negligible impact', 'Neither disagree nor agree'],
  ])],
]);

export const transform = async (
  inputDir = 'data/surveys',
  outputPath = path.join(process.cwd(), 'data/surveys/surveys.json'),
  // Wave 1/3: Level2 is always the canonical question text.
  // Wave 2: Level3 is the canonical text for single-answer questions; for multi-select
  //         sub-options Level3 embeds "ParentQuestion - SubOption", so we extract before " - ".
  questionLevelStrategy: 'level2' | 'level3' = 'level2',
  questionNormalizations: Map<string, string> = new Map(),
  answerNormalizations: Map<string, Map<string, string>> = WAVE1_ANSWER_NORMALIZATIONS,
) => {
  const logger = new Logger('ETL');

  const readJson = async (path: string) => {
    const parsed = JSON.parse(await fs.readFile(path, 'utf8'));
    return Array.isArray(parsed) ? parsed : parsed.value;
  };

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
    dataForge.fromObject(await readJson(`${inputDir}/Answer.json`)),
    dataForge.fromObject(await readJson(`${inputDir}/Survey_metadata.json`)),
    dataForge.fromObject(await readJson(`${inputDir}/Question_hierarchy.json`)),
    dataForge.fromObject(await readJson(`${inputDir}/Categorical_Answers.json`)),
  ]);

  // Exclude VTT surveys — these are test/validation entries not yet cleared for analysis
  const filteredDateDf = dateDf.where((row) => row.Value['Name'] !== 'VTT');

  logger.log(`Number of surveys: ${filteredDateDf.count()} (of ${dateDf.count()} total, VTT excluded)`);

  const join1 = answersDf.join(
    filteredDateDf,
    (leftRow) => leftRow.Value['Survey_per_dayID'],
    (rightRow) => rightRow.Value['Survey_per_dayID'],
    (leftRow, rightRow) => {
      return {
        surveyId: rightRow.Value['ID'],
        answerId: leftRow.Value['ID'],
        question: leftRow.Value['Subquestion'],
        answer: leftRow.Value['Categorical_Answer'],
        language: rightRow.Value['Survey_language'],
      };
    },
  );

  const join2 = join1.join(
    questionDf,
    (leftRow) => leftRow['question'],
    (rightRow) => rightRow.Value['ID'],
    (leftRow, rightRow) => {
      leftRow['questionId'] = leftRow['question'];
      let rawQuestionText: string;
      if (questionLevelStrategy === 'level3') {
        const l3 = rightRow.Value['Level3'] || '';
        const l2 = rightRow.Value['Level2'] || '';
        rawQuestionText = l3.includes(' - ') ? l3.split(' - ')[0].trim() : l3 || l2;
      } else {
        rawQuestionText = rightRow.Value['Level2'] || '';
      }
      const question = StringUtils.capitalizeFirstLetter(
        rawQuestionText.replace(/:/g, '').trim(),
      ).replace(/\bTo who\b/g, 'To whom');
      const afterParamNorm = questionNormalizations.get(question) ?? question;
      leftRow['question'] = WAVE3_QUESTION_NORMALIZATIONS.get(afterParamNorm) ?? afterParamNorm;
      return leftRow;
    },
  );

  const join3 = join2.join(
    answerIdDf,
    (leftRow) => leftRow['answer'],
    (rightRow) => rightRow.Value['ID'],
    (leftRow, rightRow) => {
      leftRow['answerId'] = leftRow['answer'];
      const answer = rightRow.Value['Description'].replace(/ \([\w\s]+\)/g, '');
      leftRow['answer'] = answer;
      return leftRow;
    },
  );

  const join3Normalized = join3.select((row) => {
    const answerMap = answerNormalizations.get(row['question']);
    if (answerMap) {
      const normalized = answerMap.get(row['answer']);
      if (normalized !== undefined) row['answer'] = normalized;
    }
    return row;
  });

  const filteredAnswers = join3Normalized.where((row) => {
    return (
      row['answer'].startsWith('No categorical answer') === false &&
      row['answer'] !== 'blank' &&
      row['question'] !==
        'Have specific governance models either facilitated or hindered the adoption of digital technologies in your organization?'
    );
  });

  const answersGroupByAnswers = filteredAnswers.groupBy(
    (row) => row['surveyId'],
  );

  let skippedSurveys = 0;
  let transformedAnswers = [];
  for (const group of answersGroupByAnswers) {
    let answers = group.toArray();
    let countryAnswer = answers.find(
      (e) => e['question'] === 'Location (country/region)',
    );
    if (countryAnswer === undefined) {
      console.warn(
        `survey_id: ${answers[0].surveyId} "Location (country/region)" question has no answer`,
      );

      const countryName = CountryISOMap.getCountryByNamelanguage(
        answers[0].language,
      );
      if (countryName === undefined) {
        console.error(
          `survey_id: ${answers[0].surveyId} no country code found for language ${answers[0].language} (${(++skippedSurveys + '').padStart(3, '0')})`,
        );
        continue;
      }

      countryAnswer = {
        surveyId: answers[0].surveyId,
        question: 'Location (country/region)',
        answer: countryName,
        language: answers[0].language,
        answerId: answers[0].answerId,
      };
      answers.push(countryAnswer);
    }

    const countryCode = CountryISOMap.getISO3ByCountryName(countryAnswer.answer);
    if (countryCode === undefined) {
      console.error(
        `survey_id: ${answers[0].surveyId} country code not found for "${countryAnswer.answer}" (${(++skippedSurveys + '').padStart(3, '0')})`,
      );
      continue;
    }

    answers = answers.map((e) => {
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
    outputPath,
    JSON.stringify(transformedAnswers, null, 2),
    'utf-8',
  );

  logger.log(
    `\nCreated file ${outputPath} and it contains data for ${answersGroupByAnswers.count() - skippedSurveys} surveys.`,
  );
};

if (require.main === module) {
  void transform();
}
