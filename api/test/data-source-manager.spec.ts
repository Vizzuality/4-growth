import { Repository } from 'typeorm';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { TestManager } from 'api/test/utils/test-manager';
import { Section } from '@shared/dto/sections/section.entity';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';

describe('DataSourceManager', () => {
  let testManager: TestManager<unknown>;
  let dataSourceManager: DataSourceManager;

  let sectionsRepository: Repository<Section>;
  let baseWidgetsRepository: Repository<BaseWidget>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({
      logger: false,
      initialize: false,
    });
    dataSourceManager = testManager.testApp.get(DataSourceManager);

    const dataSource = testManager.getDataSource();
    sectionsRepository = dataSource.getRepository(Section);
    baseWidgetsRepository = dataSource.getRepository(BaseWidget);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  let initialSectionCount: number;
  let initialBaseWidgetCount: number;

  it('should properly load the initial schema and data', async () => {
    // When
    await dataSourceManager.loadInitialData();

    // Then
    initialSectionCount = await sectionsRepository.count();
    expect(initialSectionCount).toBeGreaterThan(0);

    initialBaseWidgetCount = await baseWidgetsRepository.count();
    expect(initialBaseWidgetCount).toBeGreaterThan(0);
  });

  it('should not insert new records on subsequent calls (idempotency test)', async () => {
    // When
    await dataSourceManager.loadInitialData();

    // Then
    const newSectionCount = await sectionsRepository.count();
    expect(newSectionCount).toBe(initialSectionCount);

    const newBaseWidgetCount = await baseWidgetsRepository.count();
    expect(newBaseWidgetCount).toBe(initialBaseWidgetCount);
  });
});
