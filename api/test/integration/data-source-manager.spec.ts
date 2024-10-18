import { Repository } from 'typeorm';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { TestManager } from 'api/test/utils/test-manager';
import { Section } from '@shared/dto/sections/section.entity';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { PageFilter } from '@shared/dto/widgets/page-filter.entity';

describe('DataSourceManager', () => {
  let testManager: TestManager<unknown>;
  let dataSourceManager: DataSourceManager;

  let sectionsRepository: Repository<Section>;
  let baseWidgetsRepository: Repository<BaseWidget>;
  let pageFilterRepository: Repository<PageFilter>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({
      logger: false,
      initialize: false,
    });
    dataSourceManager = testManager.testApp.get(DataSourceManager);

    const dataSource = testManager.getDataSource();
    sectionsRepository = dataSource.getRepository(Section);
    baseWidgetsRepository = dataSource.getRepository(BaseWidget);
    pageFilterRepository = dataSource.getRepository(PageFilter);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  let initialSectionCount: number;
  let initialBaseWidgetCount: number;
  let initialPageFilterCount: number;

  it('should properly load the initial schema and data', async () => {
    // When
    await dataSourceManager.loadQuestionIndicatorMap();
    await Promise.all([
      dataSourceManager.loadPageFilters(),
      dataSourceManager.loadPageSections(),
      dataSourceManager.loadMockData(),
    ]);

    // Then
    initialSectionCount = await sectionsRepository.count();
    expect(initialSectionCount).toBeGreaterThan(0);

    initialBaseWidgetCount = await baseWidgetsRepository.count();
    expect(initialBaseWidgetCount).toBeGreaterThan(0);

    initialPageFilterCount = await pageFilterRepository.count();
    expect(initialPageFilterCount).toBeGreaterThan(0);
  });

  it('should not insert new records on subsequent calls (idempotency test)', async () => {
    // When
    await dataSourceManager.loadQuestionIndicatorMap();
    await Promise.all([
      dataSourceManager.loadPageFilters(),
      dataSourceManager.loadPageSections(),
      dataSourceManager.loadMockData(),
    ]);

    // Then
    const newSectionCount = await sectionsRepository.count();
    expect(newSectionCount).toBe(initialSectionCount);

    const newBaseWidgetCount = await baseWidgetsRepository.count();
    expect(newBaseWidgetCount).toBe(initialBaseWidgetCount);

    initialPageFilterCount = await pageFilterRepository.count();
    expect(initialPageFilterCount).toBeGreaterThan(0);
  });
});
