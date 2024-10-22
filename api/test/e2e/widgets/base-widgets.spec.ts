import { TestManager } from 'api/test/utils/test-manager';
import { WidgetVisualizationsType } from '@shared/dto/widgets/widget-visualizations.constants';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';

describe('Base Widgets', () => {
  let testManager: TestManager<unknown>;
  let dataSourceManager: DataSourceManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
    dataSourceManager = testManager.getModule(DataSourceManager);
  });

  beforeEach(async () => {
    await testManager.clearDatabase();
    await dataSourceManager.loadQuestionIndicatorMap();
  });

  afterAll(async () => {
    await testManager.close();
  });

  it('Should get all app base widgets', async () => {
    await dataSourceManager.loadSurveyData();
    const loadedWidgets = await testManager
      .getDataSource()
      .getRepository(BaseWidget)
      .find();
    const widgets = await testManager
      .request()
      .get('/widgets')
      .query({ disablePagination: true });
    expect(
      widgets.body.data.map((widget: BaseWidget) => ({
        indicator: widget.indicator,
        question: widget.question,
      })),
    ).toEqual(
      loadedWidgets.map((widget: BaseWidget) => ({
        indicator: widget.indicator,
        question: widget.question,
      })),
    );
  });

  it('Should get all available base widgets filtered by visualisation type', async () => {
    const vizzes = [
      ['map', 'area_graph'],
      ['bar_chart', 'line_chart'],
      ['pie_chart', 'horizontal_bar chart'],
      ['single_value', 'filter'],
      ['navigation', 'map'],
    ];

    const mocks = testManager.mocks();
    for (const [i, vizz] of vizzes.entries()) {
      const indicator = `indicator-${i}`;
      // To make sure we satify the FK_constraint
      await mocks.createQuestionIndicatorMap({
        indicator,
        question: indicator,
      });
      await mocks.createBaseWidget({
        indicator,
        visualisations: vizz as WidgetVisualizationsType[],
      });
    }

    const mapAndAreaGraphOnly = await testManager
      .request()
      .get('/widgets')
      .query({ 'visualisations[]': ['map', 'area_graph'] });

    expect(mapAndAreaGraphOnly.body.data).toHaveLength(1);
    expect(mapAndAreaGraphOnly.body.data[0].visualisations).toEqual(vizzes[0]);

    const allWithMap = await testManager
      .request()
      .get('/widgets')
      .query({ 'visualisations[]': ['map'] });

    expect(allWithMap.body.data).toHaveLength(2);
    allWithMap.body.data.forEach((widget: any) => {
      expect(widget.visualisations).toContain('map');
    });

    const noneFound = await testManager
      .request()
      .get('/widgets')
      .query({
        'visualisations[]': ['map', 'area_graph', 'horizontal_bar_chart'],
      });

    expect(noneFound.body.data).toHaveLength(0);
  });
});
