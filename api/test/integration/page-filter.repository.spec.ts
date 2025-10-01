import { QueryFailedError, Repository } from 'typeorm';
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

  it('should should throw an error when a base widget is created with an invalid question->indicator combination', async () => {
    // Given
    await dataSourceManager.loadQuestionIndicatorMap();

    // When
    let pageFilter;
    let error;
    try {
      pageFilter = await pageFilterRepository.save({
        name: 'invalid-question-indicator',
        values: [],
        label: 'Test Invalid Filter',
      });
    } catch (err) {
      error = err;
    }

    // Then
    expect(pageFilter).toBeUndefined();
    expect(error).toBeInstanceOf(QueryFailedError);
    expect(error.severity).toBe('ERROR');
    expect(error.constraint).toBe('FK_question_indicator_map');
  });
});
