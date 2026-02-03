import axios, { AxiosError } from 'axios';
import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';

export interface ODataResponse<T = unknown> {
  '@odata.context'?: string;
  '@odata.nextLink'?: string;
  value: T[];
}

export interface ODataError {
  error: {
    code: string;
    message: string;
    details?: Array<{
      code: string;
      message: string;
      target?: string;
    }>;
  };
}

export interface OAuth2TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  ext_expires_in?: number;
}

export const OAUTH_TOKEN_URL =
  'https://login.microsoftonline.com/27d137e5-761f-4dc1-af88-d26430abb18f/oauth2/v2.0/token';
export const OAUTH_SCOPE =
  'https://wageningenur4.onmicrosoft.com/odataAPIPoc/.default';

export const WAVE2_BASE_URL =
  'https://dataservices.wser.wur.nl/odata/FOURGROWTH%20Wave%20Two';

export async function getAccessToken(
  clientId: string,
  clientSecret: string,
): Promise<string> {
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('scope', OAUTH_SCOPE);
  params.append('grant_type', 'client_credentials');

  try {
    const response = await axios.post(OAUTH_TOKEN_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return response.data.access_token;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      throw new Error(
        `Authentication failed (401 Unauthorized): Invalid client credentials`,
      );
    }
    throw new Error(
      `Failed to obtain access token: ${axiosError.message || 'Unknown error'}`,
    );
  }
}

export async function fetchWithPagination(
  token: string,
  url: string,
): Promise<any[]> {
  const allRecords: any[] = [];
  let nextUrl: string | null = url;

  while (nextUrl) {
    try {
      const response = await axios.get(nextUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      const records = data.value || [];
      allRecords.push(...records);

      // Check for pagination
      nextUrl = data['@odata.nextLink'] || null;
    } catch (error) {
      const axiosError = error as AxiosError;

      // Handle specific error cases
      if (axiosError.response?.status === 401) {
        throw new Error(
          `Authentication failed (401 Unauthorized): Token may be expired or invalid`,
        );
      }

      if (axiosError.response?.status === 404) {
        throw new Error(
          `Entity not found (404 Not Found): The requested OData entity does not exist at ${url}`,
        );
      }

      if (axiosError.code === 'ECONNABORTED') {
        throw new Error(
          `Request timeout (ECONNABORTED): The request to ${url} exceeded the timeout limit`,
        );
      }

      if (axiosError.code === 'ENOTFOUND') {
        throw new Error(
          `Network error (ENOTFOUND): Unable to connect to the OData service. Check network connection.`,
        );
      }

      // Re-throw with context
      throw new Error(
        `Failed to fetch data from ${url}: ${axiosError.message || 'Unknown error'}`,
      );
    }
  }

  return allRecords;
}

export async function saveEntityData(
  data: any[],
  outputPath: string,
): Promise<void> {
  // Ensure the directory exists
  const dir = dirname(outputPath);
  await mkdir(dir, { recursive: true });

  // Write the file
  await writeFile(outputPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function fetchEntity(token: string, url: string): Promise<any[]> {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.value || [];
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(
      `Failed to fetch entity from ${url}: ${axiosError.message || 'Unknown error'}`,
    );
  }
}
