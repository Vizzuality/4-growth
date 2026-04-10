import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { EtlNotificationService } from '@api/infrastructure/etl-notification.service';

// Mock the import functions
jest.mock('../../data/surveys/extract', () => ({
  extract: jest.fn(),
}));

jest.mock('../../data/surveys/transform', () => ({
  transform: jest.fn(),
}));

jest.mock('../../data/surveys/extract-wave2', () => ({
  extractWave2: jest.fn(),
}));

jest.mock('../../data/surveys/transform-wave2', () => ({
  transformWave2: jest.fn(),
}));

describe('ETL Process Email', () => {
  let dataSourceManager: DataSourceManager;
  let etlNotificationService: EtlNotificationService;
  let mockDataSource: jest.Mocked<DataSource>;
  let mockExtract: jest.Mock;
  let mockTransform: jest.Mock;
  let mockExtractWave2: jest.Mock;
  let mockTransformWave2: jest.Mock;

  beforeEach(async () => {
    // Mock the imported functions
    const extractModule = await import('../../data/surveys/extract');
    const transformModule = await import('../../data/surveys/transform');
    const extractWave2Module = await import('../../data/surveys/extract-wave2');
    const transformWave2Module =
      await import('../../data/surveys/transform-wave2');
    mockExtract = extractModule.extract as jest.Mock;
    mockTransform = transformModule.transform as jest.Mock;
    mockExtractWave2 = extractWave2Module.extractWave2 as jest.Mock;
    mockTransformWave2 = transformWave2Module.transformWave2 as jest.Mock;

    // Mock DataSource
    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue({
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        query: jest.fn(),
        manager: {
          getRepository: jest.fn(),
        },
      }),
      getRepository: jest.fn(),
    } as any;

    // Mock EtlNotificationService
    const mockEtlNotificationService = {
      sendSuccessNotification: jest.fn(),
      sendFailureNotification: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataSourceManager,
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: getDataSourceToken(),
          useValue: mockDataSource,
        },
        {
          provide: EtlNotificationService,
          useValue: mockEtlNotificationService,
        },
      ],
    }).compile();

    dataSourceManager = module.get<DataSourceManager>(DataSourceManager);
    etlNotificationService = module.get<EtlNotificationService>(
      EtlNotificationService,
    );

    // Mock the loadInitialData method to avoid complex setup
    jest
      .spyOn(dataSourceManager, 'loadInitialData')
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('performETL', () => {
    it('should send success notification when ETL process completes successfully', async () => {
      // Arrange
      mockExtract.mockResolvedValue(undefined);
      mockTransform.mockResolvedValue(undefined);
      mockExtractWave2.mockResolvedValue(undefined);
      mockTransformWave2.mockResolvedValue(undefined);
      const sendSuccessNotificationSpy = jest.spyOn(
        etlNotificationService,
        'sendSuccessNotification',
      );

      // Act
      await dataSourceManager.performETL();

      // Assert
      expect(mockExtract).toHaveBeenCalledTimes(1);
      expect(mockTransform).toHaveBeenCalledTimes(1);
      expect(mockExtractWave2).toHaveBeenCalledTimes(1);
      expect(mockTransformWave2).toHaveBeenCalledTimes(1);
      expect(dataSourceManager.loadInitialData).toHaveBeenCalledTimes(1);
      expect(sendSuccessNotificationSpy).toHaveBeenCalledTimes(1);
      expect(
        etlNotificationService.sendFailureNotification,
      ).not.toHaveBeenCalled();
    });

    it('should send failure notification when ETL process fails during extract', async () => {
      // Arrange
      const testError = new Error('Extract failed');
      mockExtract.mockRejectedValue(testError);
      const sendFailureNotificationSpy = jest.spyOn(
        etlNotificationService,
        'sendFailureNotification',
      );

      // Act & Assert
      await expect(dataSourceManager.performETL()).rejects.toThrow(
        'Extract failed',
      );
      expect(sendFailureNotificationSpy).toHaveBeenCalledTimes(1);
      expect(sendFailureNotificationSpy).toHaveBeenCalledWith(testError);
      expect(
        etlNotificationService.sendSuccessNotification,
      ).not.toHaveBeenCalled();
    });

    it('should send failure notification when ETL process fails during transform', async () => {
      // Arrange
      const testError = new Error('Transform failed');
      mockExtract.mockResolvedValue(undefined);
      mockTransform.mockRejectedValue(testError);
      const sendFailureNotificationSpy = jest.spyOn(
        etlNotificationService,
        'sendFailureNotification',
      );

      // Act & Assert
      await expect(dataSourceManager.performETL()).rejects.toThrow(
        'Transform failed',
      );
      expect(sendFailureNotificationSpy).toHaveBeenCalledTimes(1);
      expect(sendFailureNotificationSpy).toHaveBeenCalledWith(testError);
      expect(
        etlNotificationService.sendSuccessNotification,
      ).not.toHaveBeenCalled();
    });

    it('should send failure notification when Wave 2 extraction fails', async () => {
      // Arrange
      const testError = new Error('Wave 2 extract failed');
      mockExtract.mockResolvedValue(undefined);
      mockTransform.mockResolvedValue(undefined);
      mockExtractWave2.mockRejectedValue(testError);
      const sendFailureNotificationSpy = jest.spyOn(
        etlNotificationService,
        'sendFailureNotification',
      );

      // Act & Assert
      await expect(dataSourceManager.performETL()).rejects.toThrow(
        'Wave 2 extract failed',
      );
      expect(sendFailureNotificationSpy).toHaveBeenCalledTimes(1);
      expect(sendFailureNotificationSpy).toHaveBeenCalledWith(testError);
      expect(
        etlNotificationService.sendSuccessNotification,
      ).not.toHaveBeenCalled();
    });

    it('should send failure notification when Wave 2 transformation fails', async () => {
      // Arrange
      const testError = new Error('Wave 2 transform failed');
      mockExtract.mockResolvedValue(undefined);
      mockTransform.mockResolvedValue(undefined);
      mockExtractWave2.mockResolvedValue(undefined);
      mockTransformWave2.mockRejectedValue(testError);
      const sendFailureNotificationSpy = jest.spyOn(
        etlNotificationService,
        'sendFailureNotification',
      );

      // Act & Assert
      await expect(dataSourceManager.performETL()).rejects.toThrow(
        'Wave 2 transform failed',
      );
      expect(sendFailureNotificationSpy).toHaveBeenCalledTimes(1);
      expect(sendFailureNotificationSpy).toHaveBeenCalledWith(testError);
      expect(
        etlNotificationService.sendSuccessNotification,
      ).not.toHaveBeenCalled();
    });

    it('should send failure notification when ETL process fails during loadInitialData', async () => {
      // Arrange
      const testError = new Error('Load initial data failed');
      mockExtract.mockResolvedValue(undefined);
      mockTransform.mockResolvedValue(undefined);
      mockExtractWave2.mockResolvedValue(undefined);
      mockTransformWave2.mockResolvedValue(undefined);
      jest
        .spyOn(dataSourceManager, 'loadInitialData')
        .mockRejectedValue(testError);
      const sendFailureNotificationSpy = jest.spyOn(
        etlNotificationService,
        'sendFailureNotification',
      );

      // Act & Assert
      await expect(dataSourceManager.performETL()).rejects.toThrow(
        'Load initial data failed',
      );
      expect(sendFailureNotificationSpy).toHaveBeenCalledTimes(1);
      expect(sendFailureNotificationSpy).toHaveBeenCalledWith(testError);
      expect(
        etlNotificationService.sendSuccessNotification,
      ).not.toHaveBeenCalled();
    });

    it('should call extract, transform, and loadInitialData in the correct order', async () => {
      // Arrange
      const callOrder: string[] = [];

      mockExtract.mockImplementation(() => {
        callOrder.push('extract');
        return Promise.resolve();
      });

      mockTransform.mockImplementation(() => {
        callOrder.push('transform');
        return Promise.resolve();
      });

      mockExtractWave2.mockImplementation(() => {
        callOrder.push('extractWave2');
        return Promise.resolve();
      });

      mockTransformWave2.mockImplementation(() => {
        callOrder.push('transformWave2');
        return Promise.resolve();
      });

      jest
        .spyOn(dataSourceManager, 'loadInitialData')
        .mockImplementation(() => {
          callOrder.push('loadInitialData');
          return Promise.resolve();
        });

      // Act
      await dataSourceManager.performETL();

      // Assert
      expect(callOrder).toEqual([
        'extract',
        'transform',
        'extractWave2',
        'transformWave2',
        'loadInitialData',
      ]);
    });
  });

  describe('triggerETLManually', () => {
    it('should call performETL and send notifications', async () => {
      // Arrange
      mockExtract.mockResolvedValue(undefined);
      mockTransform.mockResolvedValue(undefined);
      mockExtractWave2.mockResolvedValue(undefined);
      mockTransformWave2.mockResolvedValue(undefined);
      const performETLSpy = jest.spyOn(dataSourceManager, 'performETL');
      const sendSuccessNotificationSpy = jest.spyOn(
        etlNotificationService,
        'sendSuccessNotification',
      );

      // Act
      await dataSourceManager.triggerETLManually();

      // Assert
      expect(performETLSpy).toHaveBeenCalledTimes(1);
      expect(sendSuccessNotificationSpy).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from performETL', async () => {
      // Arrange
      const testError = new Error('Manual ETL failed');
      mockExtract.mockRejectedValue(testError);
      const sendFailureNotificationSpy = jest.spyOn(
        etlNotificationService,
        'sendFailureNotification',
      );

      // Act & Assert
      await expect(dataSourceManager.triggerETLManually()).rejects.toThrow(
        'Manual ETL failed',
      );
      expect(sendFailureNotificationSpy).toHaveBeenCalledTimes(1);
      expect(sendFailureNotificationSpy).toHaveBeenCalledWith(testError);
    });
  });
});
