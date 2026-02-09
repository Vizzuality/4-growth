import { Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CountryISOMap } from '@shared/constants/country-iso.map';
import {
  WAVE3_VARIABLE_TO_QUESTION,
  hasQuestionMapping,
} from './wave3-variable-mapping';

export interface SurveyAnswer {
  surveyId: string;
  question: string;
  answer: string;
  countryCode: string;
  wave: number;
}

interface RootRecord {
  ID: number;
  Identifier: string;
}

interface ReferenceRecord {
  ID: number;
  Name?: string;
  Description?: string;
}

interface EntityRecord {
  ID: number | string;
  RootID: number;
  [key: string]: any;
}

// TODO: Update these lists when the actual Wave 3 entity structure is known.
// Initially using the same entities as Wave 2.
const SURVEY_DATA_ENTITIES = [
  'General_Information_4GROWTH',
  'Adoption_of_Digital_Technologies_and_Technology_Integration_4GROWTH',
  'Adoption_of_digital_technologies_and_technology_integration_for_tech_providers_',
  'Data_management_and_data_sharing_practices_4GROWTH',
  'Data_storage_and_data_flows_4GROWTH',
  'Technology_Performance_4GROWTH',
  'Economic_benefits_and_impact_4GROWTH',
  'Environmental_and_sustainability_impact_4GROWTH',
  'Future_outlook_4GROWTH',
  'Associated_costs_and_prerequisites',
];

const REFERENCE_TABLES = [
  'European_countries',
  'Type_of_stakeholder',
  'Sector_',
  'AgricultureForestry_organisation_size_4GROWTH',
  'Area_Operation_forestry_4GROWTH',
  'Area_Operation_agriculture_4GROWTH',
  'Type_of_digital_technology_for_agriculture',
  'Type_of_digital_technology_for_forestry_',
  'Functions_Technologies_4GROWTH',
  'Network_connectivity',
  'Level_of_digitalisation_4GROWHT', // Network reliability scale 1-5 (typo in OData name)
  'Data_collect_4GROWTH',
  'Platforms_collect_data_4GROWTH',
  'Data_stored_4GROWTH',
  'Data_recipients',
  'YesNo',
  'YesNoDontknow',
  'Agreement_scale_5_point',
  'Geographical_reach',
  'Agricultural_organisation_type',
  'Percentages_of_products_and_services',
  'Sales_models',
  'Types_of_users_for_technology',
  'Types_of_data',
  'After_sales_support',
];

async function loadJsonFile<T>(filePath: string): Promise<T[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function loadWave3Entities(wave3Dir: string): Promise<{
  Root: RootRecord[];
  surveyData: Map<string, EntityRecord[]>;
  referenceLookup: Map<number, string>;
}> {
  // Load Root (required)
  const rootPath = path.join(wave3Dir, 'Root.json');
  let Root: RootRecord[];
  try {
    const content = await fs.readFile(rootPath, 'utf-8');
    Root = JSON.parse(content);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(
        'Required entity file not found: Root.json. Run extraction first.',
      );
    }
    throw error;
  }

  // Load all survey data entities
  const surveyData = new Map<string, EntityRecord[]>();
  for (const entity of SURVEY_DATA_ENTITIES) {
    const filePath = path.join(wave3Dir, `${entity}.json`);
    const data = await loadJsonFile<EntityRecord>(filePath);
    surveyData.set(entity, data);
  }

  const referenceLookup = new Map<number, string>();
  for (const table of REFERENCE_TABLES) {
    const filePath = path.join(wave3Dir, `${table}.json`);
    const records = await loadJsonFile<ReferenceRecord>(filePath);
    for (const record of records) {
      const text = record.Description || record.Name;
      if (text && record.ID) {
        referenceLookup.set(record.ID, text);
      }
    }
  }

  return { Root, surveyData, referenceLookup };
}

function joinEntitiesByRootID(
  rootRecords: RootRecord[],
  childRecords: EntityRecord[],
): Map<number, EntityRecord[]> {
  const result = new Map<number, EntityRecord[]>();

  for (const root of rootRecords) {
    result.set(root.ID, []);
  }

  for (const record of childRecords) {
    const existing = result.get(record.RootID);
    if (existing) {
      existing.push(record);
    }
  }

  return result;
}

function countryNameToISO3(countryName: string): string | undefined {
  return CountryISOMap.getISO3ByCountryName(countryName);
}

function cleanAnswerText(text: string): string {
  return text
    .replace(/ \([\w\s]+\)$/g, '') // Remove trailing language variant
    .trim();
}

function getSurveyId(rootRecord: RootRecord): string {
  return rootRecord.Identifier;
}

function extractAnswersFromEntity(
  record: EntityRecord,
  answerLookup: Map<number, string>,
): Array<{ variable: string; answer: string }> {
  const answers: Array<{ variable: string; answer: string }> = [];

  for (const [key, value] of Object.entries(record)) {
    if (key === 'ID' || key === 'RootID' || key === 'CalendarID') {
      continue;
    }

    if (key.endsWith('Other') || key.endsWith('Spec')) {
      continue;
    }

    if (!hasQuestionMapping(key)) {
      continue;
    }

    if (value === null || value === undefined) {
      continue;
    }

    const answerId = typeof value === 'number' ? value : parseInt(value, 10);
    if (isNaN(answerId)) {
      continue;
    }

    const description = answerLookup.get(answerId);
    if (!description?.trim()) {
      continue;
    }

    answers.push({
      variable: key,
      answer: cleanAnswerText(description),
    });
  }

  return answers;
}

async function transformWave3FromOData(
  wave3Dir: string,
  outputPath: string,
): Promise<void> {
  const logger = new Logger('ETL-Wave3-Transform');

  logger.log(`Loading Wave 3 entities from: ${wave3Dir}`);
  const { Root, surveyData, referenceLookup } =
    await loadWave3Entities(wave3Dir);
  logger.log(`Loaded ${Root.length} root records`);
  logger.log(`Created lookup for ${referenceLookup.size} categorical answers`);

  const allChildRecords: EntityRecord[] = [];
  for (const [entityName, records] of surveyData) {
    logger.log(`  ${entityName}: ${records.length} records`);
    allChildRecords.push(...records);
  }

  const recordsByRoot = joinEntitiesByRootID(Root, allChildRecords);

  const surveyAnswers: SurveyAnswer[] = [];
  let skippedSurveys = 0;

  for (const root of Root) {
    const surveyId = getSurveyId(root);
    const childRecords = recordsByRoot.get(root.ID) || [];

    let countryCode: string | undefined;
    for (const record of childRecords) {
      const locationId = record['Location_CountryRegion'];
      if (locationId !== null && locationId !== undefined) {
        const countryName = referenceLookup.get(locationId);
        if (countryName) {
          countryCode = countryNameToISO3(countryName);
          break;
        }
      }
    }

    if (!countryCode) {
      skippedSurveys++;
      continue;
    }

    for (const record of childRecords) {
      const answers = extractAnswersFromEntity(record, referenceLookup);

      for (const { variable, answer } of answers) {
        const question = WAVE3_VARIABLE_TO_QUESTION[variable];
        if (!question) {
          continue;
        }

        surveyAnswers.push({
          surveyId,
          question,
          answer,
          countryCode,
          wave: 3,
        });
      }
    }
  }

  logger.log(
    `Transformed ${surveyAnswers.length} answers from ${Root.length - skippedSurveys} surveys`,
  );
  logger.log(
    `Skipped ${skippedSurveys} surveys due to missing/invalid country`,
  );

  const outputDir = path.dirname(outputPath);
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(
    outputPath,
    JSON.stringify(surveyAnswers, null, 2),
    'utf-8',
  );

  logger.log(`Output written to: ${outputPath}`);
}

export const transformWave3 = async (): Promise<void> => {
  const wave3Dir = path.resolve(__dirname, 'wave3');
  const outputPath = path.resolve(__dirname, 'surveys-wave3.json');

  await transformWave3FromOData(wave3Dir, outputPath);
};

if (require.main === module) {
  transformWave3()
    .then(() => {
      console.log('Wave 3 transformation completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Wave 3 transformation failed:', error);
      process.exit(1);
    });
}
