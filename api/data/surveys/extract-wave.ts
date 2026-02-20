import { Logger } from '@nestjs/common';
import { z } from 'zod';
import {
  getAccessToken,
  fetchWithPagination,
  saveEntityData,
} from './odata-client';

export interface WaveExtractConfig {
  waveNumber: number;
  baseUrl: string;
  entities: string[];
  outputDir: string;
}

export const extractWave = async (config: WaveExtractConfig): Promise<void> => {
  const { waveNumber, baseUrl, entities, outputDir } = config;
  const logger = new Logger(`ETL-Wave${waveNumber}-Extract`);

  logger.log(`Starting Wave ${waveNumber} OData extraction...`);

  // Validate environment variables
  const envSchema = z.object({
    DATA_EXTRACTION_CLIENT_ID: z.string(),
    DATA_EXTRACTION_CLIENT_SECRET: z.string(),
  });
  const parsedEnv = envSchema.safeParse(process.env);

  if (!parsedEnv.success) {
    logger.error(
      `Invalid environment variables: ${parsedEnv.error.toString()}`,
    );
    throw new Error('Invalid environment variables to perform data extraction');
  }

  logger.log('Environment variables validated successfully');

  logger.log('Requesting OAuth2 access token...');
  const token = await getAccessToken(
    parsedEnv.data.DATA_EXTRACTION_CLIENT_ID,
    parsedEnv.data.DATA_EXTRACTION_CLIENT_SECRET,
  );
  logger.log('Access token retrieved successfully');

  // Extract each entity
  for (const entity of entities) {
    const entityUrl = `${baseUrl}/${entity}`;
    const outputPath = `${outputDir}/${entity}.json`;

    logger.log(`Extracting entity: ${entity}`);
    logger.log(`  URL: ${entityUrl}`);

    try {
      const data = await fetchWithPagination(token, entityUrl);
      await saveEntityData(data, outputPath);
      logger.log(`  Saved ${data.length} records to ${outputPath}`);
    } catch (error) {
      logger.error(
        `  Failed to extract ${entity}: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  logger.log(
    `\nWave ${waveNumber} extraction complete. Files saved to: ${outputDir}`,
  );
};
