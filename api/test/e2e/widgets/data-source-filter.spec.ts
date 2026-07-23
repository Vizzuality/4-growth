import { TestManager } from 'api/test/utils/test-manager';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { PageFilter } from '@shared/dto/widgets/page-filter.entity';

const TEST_SURVEYS_DATA_PATH = `${__dirname}/../../data/surveys.json`;

describe('data-source filter — API', () => {
  let testManager: TestManager<unknown>;
  let dataSourceManager: DataSourceManager;

  // Must be present in the test surveys JSON so loadSurveyData populates it.
  const TEST_INDICATOR = 'sector';

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
    dataSourceManager = testManager.getModule(DataSourceManager);

    await testManager.clearDatabase();
    await dataSourceManager.loadQuestionIndicatorMap();
    await Promise.all([
      dataSourceManager.loadPageFilters(),
      dataSourceManager.loadSurveyData(TEST_SURVEYS_DATA_PATH),
    ]);

    // Clone a couple of survey rows as automated via raw SQL so the FK on
    // (question_indicator, question) → question_indicator_map is satisfied
    // without needing to know the exact question text.
    await testManager.getDataSource().query(`
      INSERT INTO survey_answers (survey_id, question_indicator, question, answer, country_code, wave, data_source)
      SELECT
        'auto_test_' || survey_id,
        question_indicator,
        question,
        answer,
        'DEU',
        wave,
        'automated'
      FROM survey_answers
      WHERE question_indicator = '${TEST_INDICATOR}'
      LIMIT 2
      ON CONFLICT DO NOTHING
    `);

    await testManager.mocks().createBaseWidget({ indicator: TEST_INDICATOR });
  });

  afterAll(async () => {
    await testManager.close();
  });

  describe('GET /filters', () => {
    it('should include a data-source filter with values survey and automated', async () => {
      const res = await testManager.request().get('/filters');

      expect(res.status).toBe(200);
      const dataSourceFilter = res.body.data.find(
        (f: PageFilter) => f.name === 'data-source',
      );
      expect(dataSourceFilter).toBeDefined();
      expect(dataSourceFilter.values).toEqual(
        expect.arrayContaining(['survey', 'automated']),
      );
    });
  });

  describe(`GET /widgets/:id with data-source filter`, () => {
    it('should return only automated rows when filtered by data-source = automated', async () => {
      const res = await testManager
        .request()
        .get(
          `/widgets/${TEST_INDICATOR}?filters[0][name]=data-source&filters[0][operator]==&filters[0][values][0]=automated`,
        );

      expect(res.status).toBe(200);
      const chart = res.body.data.data.chart;
      expect(chart).toBeDefined();
      expect(chart.length).toBeGreaterThan(0);

      const total = chart.reduce(
        (sum: number, item: any) => sum + item.value,
        0,
      );
      expect(total).toBe(2);
    });

    it('should return only survey rows when filtered by data-source = survey', async () => {
      const surveyOnlyRes = await testManager
        .request()
        .get(
          `/widgets/${TEST_INDICATOR}?filters[0][name]=data-source&filters[0][operator]==&filters[0][values][0]=survey`,
        );
      const allRes = await testManager
        .request()
        .get(`/widgets/${TEST_INDICATOR}`);

      expect(surveyOnlyRes.status).toBe(200);
      const surveyTotal = surveyOnlyRes.body.data.data.chart.reduce(
        (sum: number, item: any) => sum + item.value,
        0,
      );
      const allTotal = allRes.body.data.data.chart.reduce(
        (sum: number, item: any) => sum + item.value,
        0,
      );

      // Unfiltered total includes automated rows, so it must be higher
      expect(allTotal).toBeGreaterThan(surveyTotal);
    });

    it('should combine data-source filter with location-country-region filter', async () => {
      const res = await testManager
        .request()
        .get(
          `/widgets/${TEST_INDICATOR}` +
            `?filters[0][name]=data-source&filters[0][operator]==&filters[0][values][0]=automated` +
            `&filters[1][name]=location-country-region&filters[1][operator]==&filters[1][values][0]=Germany`,
        );

      expect(res.status).toBe(200);
      const chart = res.body.data.data.chart;
      expect(chart).toBeDefined();

      // All automated rows are in DEU (Germany), so both pass the combined filter
      const total = chart.reduce(
        (sum: number, item: any) => sum + item.value,
        0,
      );
      expect(total).toBe(2);
    });

    it('should return empty chart data when no rows match the combined filters', async () => {
      const res = await testManager
        .request()
        .get(
          `/widgets/${TEST_INDICATOR}` +
            `?filters[0][name]=data-source&filters[0][operator]==&filters[0][values][0]=automated` +
            `&filters[1][name]=location-country-region&filters[1][operator]==&filters[1][values][0]=France`,
        );

      expect(res.status).toBe(200);
      // No automated rows in France → empty chart
      expect(res.body.data.data.chart).toEqual([]);
    });
  });
});
