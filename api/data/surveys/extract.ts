if (process.env.NODE_ENV !== 'production') {
  console.log(`${__dirname}/.env`);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const dotenv = require('dotenv');
  const envFilePath = `${process.cwd()}/data/surveys/.env`;
  dotenv.config({ path: envFilePath });
}

import { Logger } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs/promises';
import { z } from 'zod';

export const extract = async () => {
  const logger = new Logger('ETL');

  const envSchema = z.object({
    DATA_EXTRACTION_CLIENT_ID: z.string(),
    DATA_EXTRACTION_CLIENT_SECRET: z.string(),
  });
  const parsedEnv = envSchema.safeParse(process.env);

  if (!parsedEnv.success) {
    logger.error(
      `❌ Invalid environment variables: ${parsedEnv.error.toString()}`,
    );
    logger.error(
      'Cannot complete data extration process due to missing or invalid environment variables.',
    );
    throw new Error('Invalid environment variables to perform data extraction');
  }

  const getAccessToken = async (
    env: z.infer<typeof envSchema>,
  ): Promise<string> => {
    try {
      const params = new URLSearchParams();
      params.append('client_id', env.DATA_EXTRACTION_CLIENT_ID);
      params.append('client_secret', env.DATA_EXTRACTION_CLIENT_SECRET);
      params.append(
        'scope',
        'https://wageningenur4.onmicrosoft.com/odataAPIPoc/.default',
      );
      params.append('grant_type', 'client_credentials');

      const response = await axios.post(
        'https://login.microsoftonline.com/27d137e5-761f-4dc1-af88-d26430abb18f/oauth2/v2.0/token',
        params,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      return response.data.access_token;
    } catch (error) {
      console.error(
        'Error fetching access token:',
        error.response?.data || error.message,
      );
      throw error;
    }
  };

  const makeAuthenticatedRequest = async (
    token: string,
    requestUrl: string = 'https://dataservices.wecr.wur.nl/api/v1/dataset/GetDataset/',
  ) => {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      return await axios.get(requestUrl, { headers });
    } catch (error) {
      logger.error(
        `Error making authenticated request: ${JSON.stringify(error.response?.data || error.message, null, 2)}`,
      );
      throw error;
    }
  };

  const accessToken = await getAccessToken(parsedEnv.data);
  logger.log('Access token retrieved successfully.');

  const filesToExtract = [
    {
      url: 'https://dataservices.wser.wur.nl/odata/FOURGROWTH/Answer?$filter=Categorical_Answer gt 0',
      fileName: 'Answer.json',
    },
    {
      url: 'https://dataservices.wser.wur.nl/odata/FOURGROWTH/Categorical_Answers',
      fileName: 'Categorical_Answers.json',
    },
    {
      url: 'https://dataservices.wser.wur.nl/odata/FOURGROWTH/Question_hierarchy',
      fileName: 'Question_hierarchy.json',
    },
    {
      url: 'https://dataservices.wser.wur.nl/odata/FOURGROWTH/Survey_metadata',
      fileName: 'Survey_metadata.json',
    },
  ];

  for (const file of filesToExtract) {
    const { url, fileName } = file;

    const res = await makeAuthenticatedRequest(accessToken, url);
    await fs.writeFile(
      `${__dirname}/${fileName}`,
      JSON.stringify(res.data, null, 2),
    );
  }
};

if (require.main === module) {
  void extract();
}
