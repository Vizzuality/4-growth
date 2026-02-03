if (process.env.NODE_ENV !== 'production') {
  console.log(`${__dirname}/.env`);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const dotenv = require('dotenv');
  const envFilePath = `${process.cwd()}/data/surveys/.env`;
  dotenv.config({ path: envFilePath });
}

import { Logger } from '@nestjs/common';
import { z } from 'zod';
import {
  getAccessToken,
  fetchWithPagination,
  saveEntityData,
} from './odata-client';

const WAVE1_BASE_URL = 'https://dataservices.wser.wur.nl/odata/FOURGROWTH';

const WAVE1_ENTITIES = [
  {
    url: `${WAVE1_BASE_URL}/Answer?$filter=Categorical_Answer gt 0`,
    fileName: 'Answer.json',
  },
  {
    url: `${WAVE1_BASE_URL}/Categorical_Answers`,
    fileName: 'Categorical_Answers.json',
  },
  {
    url: `${WAVE1_BASE_URL}/Question_hierarchy`,
    fileName: 'Question_hierarchy.json',
  },
  {
    url: `${WAVE1_BASE_URL}/Survey_metadata`,
    fileName: 'Survey_metadata.json',
  },
];

export const extract = async () => {
  const logger = new Logger('ETL');

  const envSchema = z.object({
    DATA_EXTRACTION_CLIENT_ID: z.string(),
    DATA_EXTRACTION_CLIENT_SECRET: z.string(),
  });
  const parsedEnv = envSchema.safeParse(process.env);

  if (!parsedEnv.success) {
    logger.error(
      `Invalid environment variables: ${parsedEnv.error.toString()}`,
    );
    logger.error(
      'Cannot complete data extraction process due to missing or invalid environment variables.',
    );
    throw new Error('Invalid environment variables to perform data extraction');
  }

  logger.log('Starting Wave 1 OData extraction...');

  const accessToken = await getAccessToken(
    parsedEnv.data.DATA_EXTRACTION_CLIENT_ID,
    parsedEnv.data.DATA_EXTRACTION_CLIENT_SECRET,
  );
  logger.log('Access token retrieved successfully.');

  for (const entity of WAVE1_ENTITIES) {
    const { url, fileName } = entity;
    const outputPath = `${__dirname}/${fileName}`;

    logger.log(`Extracting: ${fileName}`);

    try {
      const data = await fetchWithPagination(accessToken, url);
      await saveEntityData(data, outputPath);
      logger.log(`  Saved ${data.length} records to ${outputPath}`);
    } catch (error) {
      logger.error(
        `  Failed to extract ${fileName}: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  logger.log('Wave 1 extraction complete.');
};

if (require.main === module) {
  void extract();
}
