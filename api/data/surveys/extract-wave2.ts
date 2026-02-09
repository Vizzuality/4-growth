if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const dotenv = require('dotenv');
  const envFilePath = `${process.cwd()}/data/surveys/.env`;
  dotenv.config({ path: envFilePath });
}

import { WAVE2_BASE_URL } from './odata-client';
import { extractWave } from './extract-wave';

export const WAVE2_ENTITIES = [
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

const OUTPUT_DIR = `${__dirname}/wave2`;

export const extractWave2 = async (): Promise<void> => {
  await extractWave({
    waveNumber: 2,
    baseUrl: WAVE2_BASE_URL,
    entities: WAVE2_ENTITIES,
    outputDir: OUTPUT_DIR,
  });
};

// Run if called directly
if (require.main === module) {
  extractWave2()
    .then(() => {
      console.log('Wave 2 extraction completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Wave 2 extraction failed:', error);
      process.exit(1);
    });
}
