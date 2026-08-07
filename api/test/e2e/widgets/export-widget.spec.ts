import { TestManager } from 'api/test/utils/test-manager';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { WIDGET_VISUALIZATIONS } from '@shared/dto/widgets/widget-visualizations.constants';
import { parse } from 'csv-parse/sync';

const TEST_SURVEYS_DATA_PATH = `${__dirname}/../../data/surveys.json`;

describe('Widgets CSV export', () => {
  let testManager: TestManager<unknown>;
  let dataSourceManager: DataSourceManager;
  let mocks: ReturnType<TestManager<unknown>['mocks']>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
    dataSourceManager = testManager.getModule(DataSourceManager);
    mocks = testManager.mocks();
    await testManager.clearDatabase();
    await dataSourceManager.loadQuestionIndicatorMap();
    await dataSourceManager.loadSurveyData(TEST_SURVEYS_DATA_PATH);
  });

  afterAll(async () => {
    await testManager.close();
  });

  beforeEach(async () => {
    await testManager
      .getDataSource()
      .getRepository(BaseWidget)
      .createQueryBuilder()
      .delete()
      .execute();
  });

  describe('GET /widgets/:id/export', () => {
    it('returns 200 with text/csv and a dated attachment filename derived from the widget title', async () => {
      await mocks.createBaseWidget({
        indicator: 'total-surveys',
        question: 'Total Surveys',
      });

      const response = await testManager
        .request()
        .get('/widgets/total-surveys/export');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.headers['content-disposition']).toMatch(
        /^attachment; filename="total-surveys-\d{4}-\d{2}-\d{2}\.csv"$/,
      );
    });

    it('serializes a counter (single_value) widget as one data row', async () => {
      await mocks.createBaseWidget({
        indicator: 'total-surveys',
        question: 'Total Surveys',
      });

      const response = await testManager
        .request()
        .get('/widgets/total-surveys/export');

      const rows = parse(response.text, { columns: true });
      expect(rows).toEqual([{ value: '5', total: '5' }]);
    });

    it('serializes a chart widget honoring filters', async () => {
      await mocks.createBaseWidget({
        indicator: 'type-of-stakeholder',
        question: 'Type of Stakeholder',
      });

      const response = await testManager
        .request()
        .get(
          '/widgets/type-of-stakeholder/export?filters[0][name]=sector&filters[0][operator]==&filters[0][values][0]=Agriculture',
        );

      expect(response.status).toBe(200);
      const rows = parse(response.text, { columns: true });
      expect(rows).toEqual([
        { label: 'Farmer/agricultural producers', value: '1', total: '2' },
        { label: 'Platform provider', value: '1', total: '2' },
      ]);
    });

    it('serializes a breakdown widget in long format', async () => {
      await mocks.createBaseWidget({
        indicator: 'sector',
        question: 'Sector',
      });

      const response = await testManager
        .request()
        .get('/widgets/sector/export?breakdown=location-country-region');

      expect(response.status).toBe(200);
      const rows = parse(response.text, { columns: true });
      expect(rows).toEqual([
        {
          breakdown_label: 'Austria',
          label: 'Forestry',
          value: '1',
          total: '1',
        },
        {
          breakdown_label: 'Belgium',
          label: 'Agriculture',
          value: '2',
          total: '2',
        },
        {
          breakdown_label: 'Bulgaria',
          label: 'Both',
          value: '1',
          total: '1',
        },
        {
          breakdown_label: 'Netherlands',
          label: 'Forestry',
          value: '1',
          total: '1',
        },
      ]);
    });

    it('returns 400 for a navigation widget (no tabular data)', async () => {
      await mocks.createBaseWidget({
        indicator: 'some-navigation',
        question: 'Navigation',
        visualisations: [WIDGET_VISUALIZATIONS.NAVIGATION],
        defaultVisualization: WIDGET_VISUALIZATIONS.NAVIGATION,
      });

      const response = await testManager
        .request()
        .get('/widgets/some-navigation/export');

      expect(response.status).toBe(400);
    });

    it('returns 404 for an unknown widget indicator', async () => {
      const response = await testManager
        .request()
        .get('/widgets/non-existent/export');

      expect(response.status).toBe(404);
    });
  });
});
