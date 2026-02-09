if (process.env.NODE_ENV !== 'production') {
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

// TODO: Update this URL when the actual Wave 3 OData endpoint is available
const WAVE3_BASE_URL =
  'https://dataservices.wser.wur.nl/odata/FOURGROWTH%20Wave%20Three';

// TODO: Update this list when the actual Wave 3 entity structure is known.
// Initially using the same entities as Wave 2.
export const WAVE3_ENTITIES = [
  // Core survey data entities
  'Root', // Central entity with Identifier
  'General_Information_4GROWTH', // Sector, stakeholder type, country, size
  'Adoption_of_Digital_Technologies_and_Technology_Integration_4GROWTH', // Technology integration
  'Adoption_of_digital_technologies_and_technology_integration_for_tech_providers_', // Tech provider questions
  'Data_management_and_data_sharing_practices_4GROWTH', // Data collection and sharing
  'Data_storage_and_data_flows_4GROWTH', // Data storage
  'Technology_Performance_4GROWTH', // Connectivity, digitalization
  'Economic_benefits_and_impact_4GROWTH', // Economic impact
  'Environmental_and_sustainability_impact_4GROWTH', // Environmental impact
  'Future_outlook_4GROWTH', // Future plans
  'Associated_costs_and_prerequisites', // Costs (provider focus)

  // Reference tables for categorical answer descriptions
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
  'Level_of_digitalisation_4GROWHT', // Note: typo in OData endpoint name (4GROWHT vs 4GROWTH)
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

const OUTPUT_DIR = `${__dirname}/wave3`;

export const extractWave3 = async (): Promise<void> => {
  const logger = new Logger('ETL-Wave3-Extract');

  logger.log('Starting Wave 3 OData extraction...');

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
  for (const entity of WAVE3_ENTITIES) {
    const entityUrl = `${WAVE3_BASE_URL}/${entity}`;
    const outputPath = `${OUTPUT_DIR}/${entity}.json`;

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

  logger.log(`\nWave 3 extraction complete. Files saved to: ${OUTPUT_DIR}`);
};

// Run if called directly
if (require.main === module) {
  extractWave3()
    .then(() => {
      console.log('Wave 3 extraction completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Wave 3 extraction failed:', error);
      process.exit(1);
    });
}
