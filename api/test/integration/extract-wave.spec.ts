import axios from 'axios';

// Mock axios before importing the module
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Generic Wave OData Extraction', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('extractWave with config', () => {
    it('should use the correct base URL from config', async () => {
      const { extractWave } = await import(
        '../../data/surveys/extract-wave'
      );

      process.env.DATA_EXTRACTION_CLIENT_ID = 'test-id';
      process.env.DATA_EXTRACTION_CLIENT_SECRET = 'test-secret';

      // Mock OAuth token
      mockedAxios.post.mockResolvedValueOnce({
        data: { access_token: 'mock-token' },
      });

      // Mock entity fetch
      mockedAxios.get.mockResolvedValue({
        data: { value: [{ id: 1 }] },
      });

      const { saveEntityData } = await import(
        '../../data/surveys/odata-client'
      );
      jest
        .spyOn(
          await import('../../data/surveys/odata-client'),
          'saveEntityData',
        )
        .mockResolvedValue(undefined);

      await extractWave({
        waveNumber: 2,
        baseUrl: 'https://example.com/odata/Wave%20Two',
        entities: ['Root'],
        outputDir: '/tmp/test-wave2',
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://example.com/odata/Wave%20Two/Root',
        expect.any(Object),
      );
    });

    it('should save files to the configured output directory', async () => {
      const odataClient = await import('../../data/surveys/odata-client');
      const saveEntityDataSpy = jest
        .spyOn(odataClient, 'saveEntityData')
        .mockResolvedValue(undefined);

      const { extractWave } = await import(
        '../../data/surveys/extract-wave'
      );

      process.env.DATA_EXTRACTION_CLIENT_ID = 'test-id';
      process.env.DATA_EXTRACTION_CLIENT_SECRET = 'test-secret';

      mockedAxios.post.mockResolvedValueOnce({
        data: { access_token: 'mock-token' },
      });

      mockedAxios.get.mockResolvedValue({
        data: { value: [{ id: 1 }] },
      });

      await extractWave({
        waveNumber: 3,
        baseUrl: 'https://example.com/odata/Wave%20Three',
        entities: ['Root', 'General_Information_4GROWTH'],
        outputDir: '/tmp/test-wave3',
      });

      expect(saveEntityDataSpy).toHaveBeenCalledWith(
        expect.any(Array),
        '/tmp/test-wave3/Root.json',
      );
      expect(saveEntityDataSpy).toHaveBeenCalledWith(
        expect.any(Array),
        '/tmp/test-wave3/General_Information_4GROWTH.json',
      );
    });

    it('should throw error when environment variables are missing', async () => {
      const { extractWave } = await import(
        '../../data/surveys/extract-wave'
      );

      delete process.env.DATA_EXTRACTION_CLIENT_ID;
      delete process.env.DATA_EXTRACTION_CLIENT_SECRET;

      await expect(
        extractWave({
          waveNumber: 2,
          baseUrl: 'https://example.com/odata/Wave%20Two',
          entities: ['Root'],
          outputDir: '/tmp/test',
        }),
      ).rejects.toThrow('Invalid environment variables');
    });

    it('should extract all entities from the config list', async () => {
      const odataClient = await import('../../data/surveys/odata-client');
      jest.spyOn(odataClient, 'saveEntityData').mockResolvedValue(undefined);

      const { extractWave } = await import(
        '../../data/surveys/extract-wave'
      );

      process.env.DATA_EXTRACTION_CLIENT_ID = 'test-id';
      process.env.DATA_EXTRACTION_CLIENT_SECRET = 'test-secret';

      mockedAxios.post.mockResolvedValueOnce({
        data: { access_token: 'mock-token' },
      });

      mockedAxios.get.mockResolvedValue({
        data: { value: [] },
      });

      const entities = ['Root', 'EntityA', 'EntityB'];

      await extractWave({
        waveNumber: 2,
        baseUrl: 'https://example.com/odata/Wave',
        entities,
        outputDir: '/tmp/test',
      });

      expect(mockedAxios.get).toHaveBeenCalledTimes(entities.length);
      for (const entity of entities) {
        expect(mockedAxios.get).toHaveBeenCalledWith(
          `https://example.com/odata/Wave/${entity}`,
          expect.any(Object),
        );
      }
    });

    it('should propagate errors from entity extraction', async () => {
      const odataClient = await import('../../data/surveys/odata-client');
      jest.spyOn(odataClient, 'saveEntityData').mockResolvedValue(undefined);

      const { extractWave } = await import(
        '../../data/surveys/extract-wave'
      );

      process.env.DATA_EXTRACTION_CLIENT_ID = 'test-id';
      process.env.DATA_EXTRACTION_CLIENT_SECRET = 'test-secret';

      mockedAxios.post.mockResolvedValueOnce({
        data: { access_token: 'mock-token' },
      });

      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 404 },
        message: 'Entity not found (404 Not Found): The requested OData entity does not exist at url',
      });

      await expect(
        extractWave({
          waveNumber: 2,
          baseUrl: 'https://example.com/odata/Wave',
          entities: ['NonExistent'],
          outputDir: '/tmp/test',
        }),
      ).rejects.toThrow();
    });
  });
});
