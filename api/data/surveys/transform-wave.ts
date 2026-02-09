import { Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CountryISOMap } from '@shared/constants/country-iso.map';

export interface SurveyAnswer {
  surveyId: string;
  question: string;
  answer: string;
  countryCode: string;
  wave: number;
}

export interface RootRecord {
  ID: number;
  Identifier: string;
}

interface ReferenceRecord {
  ID: number;
  Name?: string;
  Description?: string;
}

export interface EntityRecord {
  ID: number | string;
  RootID: number;
  [key: string]: any;
}

export interface WaveTransformConfig {
  waveNumber: number;
  inputDir: string;
  outputPath: string;
  variableMapping: Record<string, string>;
  hasQuestionMapping: (variable: string) => boolean;
}

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

export async function loadWaveEntities(waveDir: string): Promise<{
  Root: RootRecord[];
  surveyData: Map<string, EntityRecord[]>;
  referenceLookup: Map<number, string>;
}> {
  // Load Root (required)
  const rootPath = path.join(waveDir, 'Root.json');
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
    const filePath = path.join(waveDir, `${entity}.json`);
    const data = await loadJsonFile<EntityRecord>(filePath);
    surveyData.set(entity, data);
  }

  const referenceLookup = new Map<number, string>();
  for (const table of REFERENCE_TABLES) {
    const filePath = path.join(waveDir, `${table}.json`);
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

export function joinEntitiesByRootID(
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

export function extractCountryFromSurvey(
  surveyRecords: Array<{ variable?: string; categorical_answer_ID?: number }>,
  categoricalAnswers: Array<{ ID: number; Description: string }>,
): string | undefined {
  const countryRecord = surveyRecords.find(
    (r) => r.variable === 'Location_CountryRegion',
  );

  if (!countryRecord?.categorical_answer_ID) {
    return undefined;
  }

  const answer = categoricalAnswers.find(
    (a) => a.ID === countryRecord.categorical_answer_ID,
  );

  return answer?.Description;
}

export function countryNameToISO3(countryName: string): string | undefined {
  return CountryISOMap.getISO3ByCountryName(countryName);
}

export function filterCategoricalAnswers<T extends { answer_type?: string }>(
  records: T[],
): T[] {
  return records.filter((r) => r.answer_type === 'categorical_answer');
}

export function filterValidAnswers<T extends { Description?: string }>(
  records: T[],
): T[] {
  return records.filter((r) => r.Description?.trim());
}

export function cleanAnswerText(text: string): string {
  return text
    .replace(/ \([\w\s]+\)$/g, '') // Remove trailing language variant
    .trim();
}

export function getSurveyId(rootRecord: RootRecord): string {
  return rootRecord.Identifier;
}

function extractAnswersFromEntity(
  record: EntityRecord,
  answerLookup: Map<number, string>,
  hasMapping: (variable: string) => boolean,
): Array<{ variable: string; answer: string }> {
  const answers: Array<{ variable: string; answer: string }> = [];

  for (const [key, value] of Object.entries(record)) {
    if (key === 'ID' || key === 'RootID' || key === 'CalendarID') {
      continue;
    }

    if (key.endsWith('Other') || key.endsWith('Spec')) {
      continue;
    }

    if (!hasMapping(key)) {
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

export async function transformWaveFromOData(
  config: WaveTransformConfig,
): Promise<void> {
  const { waveNumber, inputDir, outputPath, variableMapping, hasQuestionMapping } = config;
  const logger = new Logger(`ETL-Wave${waveNumber}-Transform`);

  logger.log(`Loading Wave ${waveNumber} entities from: ${inputDir}`);
  const { Root, surveyData, referenceLookup } =
    await loadWaveEntities(inputDir);
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
      const answers = extractAnswersFromEntity(
        record,
        referenceLookup,
        hasQuestionMapping,
      );

      for (const { variable, answer } of answers) {
        const question = variableMapping[variable];
        if (!question) {
          continue;
        }

        surveyAnswers.push({
          surveyId,
          question,
          answer,
          countryCode,
          wave: waveNumber,
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
