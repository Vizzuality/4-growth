import { TestManager } from 'api/test/utils/test-manager';
import {
  WIDGET_VISUALIZATIONS,
  WidgetVisualizationsType,
} from '@shared/dto/widgets/widget-visualizations.constants';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import ObjectUtils from 'api/test/utils/object.utils';

const TEST_SURVEYS_DATA_PATH = `${__dirname}/../../data/surveys.json`;

describe('Base Widgets', () => {
  let testManager: TestManager<unknown>;
  let dataSourceManager: DataSourceManager;
  let mocks: ReturnType<TestManager<unknown>['mocks']>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
    dataSourceManager = testManager.getModule(DataSourceManager);
    mocks = testManager.mocks();
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

    for (const [i, vizz] of vizzes.entries()) {
      const indicator = `indicator-${i}`;
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
        'visualisations[]': [
          WIDGET_VISUALIZATIONS.MAP,
          WIDGET_VISUALIZATIONS.AREA_GRAPH,
          WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART,
        ],
      });

    expect(noneFound.body.data).toHaveLength(0);
  });

  it('Should retrieve a widget with its data by its id (indicator)', async () => {
    // Given
    const dataSourceManager = testManager.testApp.get(DataSourceManager);
    await dataSourceManager.loadQuestionIndicatorMap();
    await dataSourceManager.loadSurveyData(TEST_SURVEYS_DATA_PATH);

    const indicator = 'total-surveys';
    const createdWidget = await mocks.createBaseWidget({
      indicator,
    });

    // When
    const result = await testManager.request().get(`/widgets/${indicator}`);
    const returnedWidget = result.body.data;

    const createdWidgetWithData = {
      ...ObjectUtils.normalizeDates(createdWidget),
      data: {
        counter: { value: 5, total: 5 },
      },
    };
    // Then
    expect(returnedWidget).toStrictEqual(createdWidgetWithData);
  });

  it('Should retrieve a widget with its filtered data by its id (indicator)', async () => {
    // Given
    const dataSourceManager = testManager.testApp.get(DataSourceManager);
    await dataSourceManager.loadQuestionIndicatorMap();
    await dataSourceManager.loadSurveyData(TEST_SURVEYS_DATA_PATH);

    const indicator = 'total-surveys';
    const createdWidget = await mocks.createBaseWidget({
      indicator,
    });

    // When
    const result = await testManager
      .request()
      .get(
        `/widgets/${indicator}?filters[0][name]=eu-member-state&filters[0][operator]==&filters[0][values][0]=Belgium`,
      );

    const returnedWidget = result.body.data;

    const createdWidgetWithData = {
      ...ObjectUtils.normalizeDates(createdWidget),
      data: {
        counter: { value: 2, total: 5 },
      },
    };
    // Then
    expect(returnedWidget).toStrictEqual(createdWidgetWithData);
  });

  it.each([
    [
      'Should retrieve a widget that can be viewed as a map with its data by its id (indicator)',
      {
        indicator: 'energy-efficiency',
        question: 'Have digital technologies contributed to energy efficiency?',
        visualisations: [WIDGET_VISUALIZATIONS.MAP],
        defaultVisualization: WIDGET_VISUALIZATIONS.MAP,
      },
      {
        map: [
          { country: 'AUT', count: 1 },
          { country: 'BEL', count: 1 },
        ],
      },
    ],
    [
      "Should retrieve a widget that can be viewed as a map with its data by its id (indicator). Edge Case: 'adoption-of-technology-by-country'",
      {
        indicator: 'adoption-of-technology-by-country',
        question:
          'Has your organisation integrated digital technologies into its workflows?',
        visualisations: [WIDGET_VISUALIZATIONS.MAP],
        defaultVisualization: WIDGET_VISUALIZATIONS.MAP,
      },
      {
        map: [
          { country: 'BEL', count: 1 },
          { country: 'NLD', count: 1 },
        ],
      },
    ],
  ])('%s', async (description, widgetPrimitives, expectedData) => {
    // Given
    const dataSourceManager = testManager.testApp.get(DataSourceManager);
    await dataSourceManager.loadQuestionIndicatorMap();
    await dataSourceManager.loadSurveyData(TEST_SURVEYS_DATA_PATH);

    const widget = await mocks.createBaseWidget(widgetPrimitives);
    // When
    const result = await testManager
      .request()
      .get(`/widgets/${widget.indicator}`);

    const returnedWidget = result.body.data;

    const createdWidgetWithData = {
      ...ObjectUtils.normalizeDates(widget),
      data: expectedData,
    };

    // Then
    expect(returnedWidget).toStrictEqual(createdWidgetWithData);
  });

  it('Should return a 404 status code when retrieving a widget by a non-existent indicator', async () => {
    // Given
    const indicator = 'non-existent-indicator';

    // When
    const result = await testManager.request().get(`/widgets/${indicator}`);

    // Then

    expect(result.status).toBe(404);
  });
});
