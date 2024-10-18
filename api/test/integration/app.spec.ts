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

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  it('should call dataSourceManager.loadInitialData when it starts', async () => {
    const loadQuestionIndicatorMapSpy = jest.spyOn(
      dataSourceManager,
      'loadQuestionIndicatorMap',
    );
    const loadPageFiltersSpy = jest.spyOn(dataSourceManager, 'loadPageFilters');
    const loadPageSectionsSpy = jest.spyOn(
      dataSourceManager,
      'loadPageSections',
    );
    const loadMockDataSpy = jest.spyOn(dataSourceManager, 'loadMockData');

    // When
    await testApp.init();

    // Then
    expect(loadQuestionIndicatorMapSpy).toHaveBeenCalledTimes(1);
    expect(loadPageFiltersSpy).toHaveBeenCalledTimes(1);
    expect(loadPageSectionsSpy).toHaveBeenCalledTimes(1);
    expect(loadMockDataSpy).toHaveBeenCalledTimes(1);
  });
});
