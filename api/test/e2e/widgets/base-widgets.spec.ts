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

  afterAll(async () => {
    await testManager.close();
  });

  describe('Tests with test survey data', () => {
    beforeAll(async () => {
      await testManager.clearDatabase();
      await dataSourceManager.loadQuestionIndicatorMap();
      await dataSourceManager.loadSurveyData(TEST_SURVEYS_DATA_PATH);
    });

    beforeEach(async () => {
      await testManager
        .getDataSource()
        .getRepository(BaseWidget)
        .createQueryBuilder()
        .delete()
        .execute();
    });

    it('Should return the description field when retrieving a widget by its id', async () => {
      const indicator = 'total-surveys';
      const description = 'This is a test description';
      await mocks.createBaseWidget({
        indicator,
        description,
      });

      const result = await testManager.request().get(`/widgets/${indicator}`);
      const returnedWidget = result.body.data;

      expect(returnedWidget.description).toBe(description);
    });

    it('Should retrieve a widget with its data by its id (indicator)', async () => {
      const indicator = 'total-surveys';
      const createdWidget = await mocks.createBaseWidget({
        indicator,
      });

      const result = await testManager.request().get(`/widgets/${indicator}`);
      const returnedWidget = result.body.data;

      const createdWidgetWithData = {
        ...ObjectUtils.normalizeDates(createdWidget),
        data: {
          counter: { value: 5, total: 5 },
        },
      };

      expect(returnedWidget).toStrictEqual(createdWidgetWithData);
    });

    it.each([
      [
        'total-surveys',
        '?filters[0][name]=location-country-region&filters[0][operator]==&filters[0][values][0]=Belgium',
        {
          counter: { value: 2, total: 5 },
        },
      ],
      [
        'type-of-stakeholder',
        '?filters[0][name]=sector&filters[0][operator]==&filters[0][values][0]=Agriculture',
        {
          chart: [
            { label: 'Farmer/agricultural producers', value: 1, total: 2 },
            { label: 'Platform provider', value: 1, total: 2 },
          ],
        },
      ],
    ])(
      'Should retrieve a widget with its filtered data by its id (indicator)',
      async (indicator: string, urlParams: string, expectedData: unknown) => {
        const createdWidget = await mocks.createBaseWidget({
          indicator,
        });

        const result = await testManager
          .request()
          .get(`/widgets/${indicator}${urlParams}`);

        const returnedWidget = result.body.data;

        const createdWidgetWithData = {
          ...ObjectUtils.normalizeDates(createdWidget),
          data: expectedData,
        };

        expect(returnedWidget).toStrictEqual(createdWidgetWithData);
      },
    );

    it.each([
      [
        'Should retrieve a widget that can be viewed as a map with its data by its id (indicator)',
        {
          indicator: 'energy-efficiency',
          question:
            'Have digital technologies contributed to energy efficiency?',
          visualisations: [WIDGET_VISUALIZATIONS.MAP],
          defaultVisualization: WIDGET_VISUALIZATIONS.MAP,
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
      ],
    ])('%s', async (description, widgetPrimitives) => {
      const widget = await mocks.createBaseWidget(widgetPrimitives);

      const result = await testManager
        .request()
        .get(`/widgets/${widget.indicator}`);

      const returnedWidget = result.body.data;

      expect(Array.isArray(returnedWidget.data?.map)).toBe(true);
      for (const entry of returnedWidget.data.map) {
        expect(Object.keys(entry)).toEqual(
          expect.arrayContaining(['country', 'value']),
        );
      }
    });

    it.each([
      [
        'Should retrieve the data breakdown of a widget by its id (indicator) against another question indicator',
        { indicator: 'sector' },
        '',
        {
          breakdown: [
            {
              label: 'Austria',
              data: [
                {
                  label: 'Forestry',
                  value: 1,
                  total: 1,
                },
              ],
            },
            {
              label: 'Belgium',
              data: [
                {
                  label: 'Agriculture',
                  value: 2,
                  total: 2,
                },
              ],
            },
            {
              label: 'Bulgaria',
              data: [
                {
                  label: 'Both',
                  value: 1,
                  total: 1,
                },
              ],
            },
            {
              label: 'Netherlands',
              data: [
                {
                  label: 'Forestry',
                  value: 1,
                  total: 1,
                },
              ],
            },
          ],
        },
      ],
      [
        'Should retrieve the data breakdown of a widget by its id (indicator) against another question indicator (with filters)',
        { indicator: 'sector' },
        '&filters[0][name]=location-country-region&filters[0][operator]==&filters[0][values][0]=Belgium',
        {
          breakdown: [
            {
              label: 'Belgium',
              data: [
                {
                  label: 'Agriculture',
                  value: 2,
                  total: 2,
                },
              ],
            },
          ],
        },
      ],
    ])(
      '%s',
      async (
        description,
        widgetPrimitives,
        additionalUrlParams,
        expectedData,
      ) => {
        const createdWidget = await mocks.createBaseWidget(widgetPrimitives);

        const result = await testManager
          .request()
          .get(
            `/widgets/${widgetPrimitives.indicator}?breakdown=location-country-region${additionalUrlParams}`,
          );

        const returnedWidget = result.body.data;

        const createdWidgetWithData = {
          ...ObjectUtils.normalizeDates(createdWidget),
          data: expectedData,
        };

        expect(returnedWidget).toStrictEqual(createdWidgetWithData);
      },
    );

    it('Should retrieve no data of a widget with data by its id (indicator) if the breakdown indicator does not exist', async () => {
      const indicator = 'sector';
      const createdWidget = await mocks.createBaseWidget({
        indicator,
      });

      const result = await testManager
        .request()
        .get(`/widgets/${indicator}?breakdown=non-existent-indicator`);

      const returnedWidget = result.body.data;

      const createdWidgetWithData = {
        ...ObjectUtils.normalizeDates(createdWidget),
        data: { breakdown: [] },
      };

      expect(returnedWidget).toStrictEqual(createdWidgetWithData);
    });
  });

  describe('Tests without survey data', () => {
    beforeEach(async () => {
      await testManager.clearDatabase();
      await dataSourceManager.loadQuestionIndicatorMap();
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
      expect(mapAndAreaGraphOnly.body.data[0].visualisations).toEqual(
        vizzes[0],
      );

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

    it('Should return a 404 status code when retrieving a widget by a non-existent indicator', async () => {
      const indicator = 'non-existent-indicator';

      const result = await testManager.request().get(`/widgets/${indicator}`);

      expect(result.status).toBe(404);
    });
  });
});
