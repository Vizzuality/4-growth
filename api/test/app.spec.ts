import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { INestApplication } from '@nestjs/common';
import { TestManager } from 'api/test/utils/test-manager';

describe('App', () => {
  let testManager: TestManager<unknown>;
  let testApp: INestApplication<unknown>;
  let dataSourceManager: DataSourceManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({
      logger: false,
      initialize: false,
    });
    testApp = testManager.testApp;
    dataSourceManager = testManager.testApp.get(DataSourceManager);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  it('should call dataSourceManager.loadInitialData when it starts', async () => {
    const loadInitialDataSpy = jest.spyOn(dataSourceManager, 'loadInitialData');

    // When
    await testApp.init();

    // Then
    expect(loadInitialDataSpy).toHaveBeenCalledTimes(1);
  });
});
