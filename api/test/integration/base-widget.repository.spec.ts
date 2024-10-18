import { QueryFailedError, Repository } from 'typeorm';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { TestManager } from 'api/test/utils/test-manager';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { WIDGET_VISUALIZATIONS } from '@shared/dto/widgets/widget-visualizations.constants';

describe('BaseWidgetRepository', () => {
  let testManager: TestManager<unknown>;
  let dataSourceManager: DataSourceManager;

  let baseWidgetsRepository: Repository<BaseWidget>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({
      logger: false,
      initialize: false,
    });
    dataSourceManager = testManager.testApp.get(DataSourceManager);

    const dataSource = testManager.getDataSource();
    baseWidgetsRepository = dataSource.getRepository(BaseWidget);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  it('should should throw an error when a base widget is created with an invalid question->indicator combination', async () => {
    // Given
    await dataSourceManager.loadQuestionIndicatorMap();

    // When
    let baseWidget;
    let error;
    try {
      baseWidget = await baseWidgetsRepository.save({
        indicator: 'invalid-indicator',
        question: 'invalid-question',
        visualisations: [
          WIDGET_VISUALIZATIONS.AREA_GRAPH,
          WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART,
        ],
        defaultVisualization: WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART,
        sectionOrder: 1,
      });
    } catch (err) {
      error = err;
    }

    // Then
    expect(baseWidget).toBeUndefined();
    expect(error).toBeInstanceOf(QueryFailedError);
    expect(error.severity).toBe('ERROR');
    expect(error.constraint).toBe('FK_question_indicator_map');
  });
});
