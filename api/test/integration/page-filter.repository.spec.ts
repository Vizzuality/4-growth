import { Repository } from 'typeorm';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { TestManager } from 'api/test/utils/test-manager';
import { PageFilter } from '@shared/dto/widgets/page-filter.entity';

describe('PageFilterRepository', () => {
  let testManager: TestManager<unknown>;
  let dataSourceManager: DataSourceManager;

  let pageFilterRepository: Repository<PageFilter>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({
      logger: false,
      initialize: false,
    });
    dataSourceManager = testManager.testApp.get(DataSourceManager);

    const dataSource = testManager.getDataSource();
    pageFilterRepository = dataSource.getRepository(PageFilter);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  it('should allow saving a page filter whose name is not a question indicator', async () => {
    // Given
    await dataSourceManager.loadQuestionIndicatorMap();

    // When — data-source is a metadata filter not backed by a question indicator;
    // the FK that used to enforce this was intentionally dropped (see migration
    // 1775000000000-add-data-source-to-survey-answers).
    const pageFilter = await pageFilterRepository.save({
      name: 'data-source',
      values: ['survey', 'automated'],
      label: 'Data source',
    });

    // Then
    expect(pageFilter).toBeDefined();
    expect(pageFilter.name).toBe('data-source');
  });
});
