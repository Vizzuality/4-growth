import { mkdtemp, rm, readFile, stat } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import axios from 'axios';

// Mock axios before importing the module
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// We'll import the module functions after mocking
let extractWave2: () => Promise<void>;
let getAccessToken: (clientId: string, clientSecret: string) => Promise<string>;
let fetchWithPagination: (token: string, url: string) => Promise<any[]>;

describe('Wave 2 OData Extraction', () => {
  const originalEnv = process.env;
  let tmpDir: string;

  beforeAll(async () => {
    tmpDir = await mkdtemp(join(tmpdir(), 'wave2-extract-test-'));
  });

  afterAll(async () => {
    await rm(tmpDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('OAuth Token Request', () => {
    it('should request token with correct OAuth2 parameters', async () => {
      const { getAccessToken } = await import(
        '../../data/surveys/odata-client'
      );

      mockedAxios.post.mockResolvedValueOnce({
        data: { access_token: 'mock-token-123' },
      });

      await getAccessToken('test-client-id', 'test-client-secret');

      expect(mockedAxios.post).toHaveBeenCalledTimes(1);

      const [url, params, config] = mockedAxios.post.mock.calls[0];

      expect(url).toBe(
        'https://login.microsoftonline.com/27d137e5-761f-4dc1-af88-d26430abb18f/oauth2/v2.0/token',
      );

      // Check that URLSearchParams contains correct values
      expect(params.toString()).toContain('client_id=test-client-id');
      expect(params.toString()).toContain('client_secret=test-client-secret');
      expect(params.toString()).toContain(
        'scope=https%3A%2F%2Fwageningenur4.onmicrosoft.com%2FodataAPIPoc%2F.default',
      );
      expect(params.toString()).toContain('grant_type=client_credentials');

      expect(config?.headers?.['Content-Type']).toBe(
        'application/x-www-form-urlencoded',
      );
    });

    it('should return access token on successful authentication', async () => {
      const { getAccessToken } = await import(
        '../../data/surveys/odata-client'
      );

      mockedAxios.post.mockResolvedValueOnce({
        data: { access_token: 'valid-token-xyz' },
      });

      const token = await getAccessToken('test-id', 'test-secret');

      expect(token).toBe('valid-token-xyz');
    });

    it('should throw error on authentication failure', async () => {
      const { getAccessToken } = await import(
        '../../data/surveys/odata-client'
      );

      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { error: 'invalid_client' },
        },
      });

      await expect(getAccessToken('bad-id', 'bad-secret')).rejects.toThrow();
    });
  });

  describe('Wave 2 Endpoint Usage', () => {
    it('should use correct Wave 2 OData base URL', async () => {
      const { WAVE2_BASE_URL } = await import(
        '../../data/surveys/odata-client'
      );

      expect(WAVE2_BASE_URL).toBe(
        'https://dataservices.wser.wur.nl/odata/FOURGROWTH%20Wave%20Two',
      );
    });

    it('should extract all required Wave 2 entities', async () => {
      const { WAVE2_ENTITIES } = await import(
        '../../data/surveys/extract-wave2'
      );

      // Core entities required for Wave 2 (actual OData entity names)
      expect(WAVE2_ENTITIES).toContain('Root');
      expect(WAVE2_ENTITIES).toContain('General_Information_4GROWTH');
      expect(WAVE2_ENTITIES).toContain(
        'Adoption_of_Digital_Technologies_and_Technology_Integration_4GROWTH',
      );
      expect(WAVE2_ENTITIES).toContain(
        'Data_management_and_data_sharing_practices_4GROWTH',
      );
      expect(WAVE2_ENTITIES).toContain('Technology_Performance_4GROWTH');
      expect(WAVE2_ENTITIES).toContain('Associated_costs_and_prerequisites');
    });
  });

  describe('OData Pagination Handling', () => {
    it('should fetch all pages when @odata.nextLink is present', async () => {
      const { fetchWithPagination } = await import(
        '../../data/surveys/odata-client'
      );

      // First page with nextLink
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          value: [{ id: 1 }, { id: 2 }],
          '@odata.nextLink':
            'https://dataservices.wser.wur.nl/odata/FOURGROWTH%20Wave%20Two/Root?$skip=2',
        },
      });

      // Second page with nextLink
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          value: [{ id: 3 }, { id: 4 }],
          '@odata.nextLink':
            'https://dataservices.wser.wur.nl/odata/FOURGROWTH%20Wave%20Two/Root?$skip=4',
        },
      });

      // Third page without nextLink (last page)
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          value: [{ id: 5 }],
        },
      });

      const result = await fetchWithPagination(
        'mock-token',
        'https://test.com/Root',
      );

      expect(result).toHaveLength(5);
      expect(result).toEqual([
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
      ]);
      expect(mockedAxios.get).toHaveBeenCalledTimes(3);
    });

    it('should return data from single page when no nextLink is present', async () => {
      const { fetchWithPagination } = await import(
        '../../data/surveys/odata-client'
      );

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          value: [{ id: 1 }, { id: 2 }],
        },
      });

      const result = await fetchWithPagination(
        'mock-token',
        'https://test.com/Root',
      );

      expect(result).toHaveLength(2);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('should include Authorization header in paginated requests', async () => {
      const { fetchWithPagination } = await import(
        '../../data/surveys/odata-client'
      );

      mockedAxios.get.mockResolvedValueOnce({
        data: { value: [{ id: 1 }] },
      });

      await fetchWithPagination('test-bearer-token', 'https://test.com/Entity');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://test.com/Entity',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-bearer-token',
          }),
        }),
      );
    });
  });

  describe('File Writing', () => {
    it('should write extracted data to JSON files in wave2 directory', async () => {
      const { saveEntityData } = await import(
        '../../data/surveys/odata-client'
      );

      const testData = [{ id: 1, name: 'test' }];
      const outputPath = join(tmpDir, 'test-entity.json');

      await saveEntityData(testData, outputPath);

      const fileContent = await readFile(outputPath, 'utf-8');
      const parsedContent = JSON.parse(fileContent);

      expect(parsedContent).toEqual(testData);
    });

    it('should create output directory if it does not exist', async () => {
      const { saveEntityData } = await import(
        '../../data/surveys/odata-client'
      );

      const nestedDir = join(tmpDir, 'nested', 'wave2');
      const outputPath = join(nestedDir, 'entity.json');

      await saveEntityData([{ id: 1 }], outputPath);

      const stats = await stat(nestedDir);
      expect(stats.isDirectory()).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should throw descriptive error on 401 Unauthorized', async () => {
      const { fetchWithPagination } = await import(
        '../../data/surveys/odata-client'
      );

      mockedAxios.get.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { error: 'Unauthorized' },
        },
        message: 'Request failed with status code 401',
      });

      await expect(
        fetchWithPagination('invalid-token', 'https://test.com/Entity'),
      ).rejects.toThrow(/401|Unauthorized|authentication/i);
    });

    it('should throw descriptive error on 404 Not Found', async () => {
      const { fetchWithPagination } = await import(
        '../../data/surveys/odata-client'
      );

      mockedAxios.get.mockRejectedValueOnce({
        response: {
          status: 404,
          data: { error: 'Not Found' },
        },
        message: 'Request failed with status code 404',
      });

      await expect(
        fetchWithPagination('valid-token', 'https://test.com/NonExistent'),
      ).rejects.toThrow(/404|Not Found|entity/i);
    });

    it('should throw descriptive error on timeout', async () => {
      const { fetchWithPagination } = await import(
        '../../data/surveys/odata-client'
      );

      mockedAxios.get.mockRejectedValueOnce({
        code: 'ECONNABORTED',
        message: 'timeout of 30000ms exceeded',
      });

      await expect(
        fetchWithPagination('valid-token', 'https://test.com/Entity'),
      ).rejects.toThrow(/timeout|ECONNABORTED/i);
    });

    it('should throw descriptive error on network failure', async () => {
      const { fetchWithPagination } = await import(
        '../../data/surveys/odata-client'
      );

      mockedAxios.get.mockRejectedValueOnce({
        code: 'ENOTFOUND',
        message: 'getaddrinfo ENOTFOUND dataservices.wser.wur.nl',
      });

      await expect(
        fetchWithPagination('valid-token', 'https://test.com/Entity'),
      ).rejects.toThrow(/network|ENOTFOUND|connection/i);
    });
  });
});
