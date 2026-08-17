import { TestManager } from 'api/test/utils/test-manager';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { PageFilter } from '@shared/dto/widgets/page-filter.entity';

const TEST_SURVEYS_DATA_PATH = `${__dirname}/../../data/surveys.json`;

describe('data-source filter — API', () => {
  let testManager: TestManager<unknown>;
  let dataSourceManager: DataSourceManager;

  // Must be present in the test surveys JSON so loadSurveyData populates it.
  const TEST_INDICATOR = 'sector';
  const COUNTER_INDICATOR = 'total-surveys';

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
    await testManager
      .mocks()
      .createBaseWidget({ indicator: COUNTER_INDICATOR });
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

  describe(`GET /widgets/${COUNTER_INDICATOR} counter denominator`, () => {
    const countDistinctSurveys = async (where = ''): Promise<number> => {
      const [{ count }] = await testManager
        .getDataSource()
        .query(
          `SELECT COUNT(DISTINCT survey_id)::integer AS count FROM survey_answers ${where}`,
        );
      return count;
    };

    it('should measure the value against the selected data source only', async () => {
      const surveyOnly = await countDistinctSurveys(
        `WHERE data_source = 'survey'`,
      );
      // Without automated surveys in the fixture the assertion below is vacuous
      expect(await countDistinctSurveys()).toBeGreaterThan(surveyOnly);

      const res = await testManager
        .request()
        .get(
          `/widgets/${COUNTER_INDICATOR}?filters[0][name]=data-source&filters[0][operator]==&filters[0][values][0]=survey`,
        );

      expect(res.status).toBe(200);
      expect(res.body.data.data.counter).toEqual({
        value: surveyOnly,
        total: surveyOnly,
      });
    });

    it('should measure the value against every source when no data-source filter is sent', async () => {
      const allSources = await countDistinctSurveys();

      const res = await testManager
        .request()
        .get(`/widgets/${COUNTER_INDICATOR}`);

      expect(res.status).toBe(200);
      expect(res.body.data.data.counter).toEqual({
        value: allSources,
        total: allSources,
      });
    });
  });

  describe('source comparison', () => {
    const OVERLAP_ANSWER = 'AutomatedOnlyAnswer';
    const bothSources =
      `?filters[0][name]=data-source&filters[0][operator]==` +
      `&filters[0][values][0]=survey&filters[0][values][1]=automated`;

    beforeAll(async () => {
      // An automated row that shares a survey_id with existing survey rows.
      // Filtering data-source at survey level would pull that survey's *survey*
      // rows into the automated result; filtering at row level must not.
      await testManager.getDataSource().query(`
        INSERT INTO survey_answers (survey_id, question_indicator, question, answer, country_code, wave, data_source)
        SELECT survey_id, question_indicator, question, '${OVERLAP_ANSWER}', country_code, wave, 'automated'
        FROM survey_answers
        WHERE question_indicator = '${TEST_INDICATOR}' AND data_source = 'survey'
        LIMIT 1
        ON CONFLICT DO NOTHING
      `);
    });

    const sumChart = (chart: { value: number }[]) =>
      chart.reduce((sum, entry) => sum + entry.value, 0);

    it('should not leak survey rows of a survey that also has automated rows', async () => {
      const res = await testManager
        .request()
        .get(
          `/widgets/${TEST_INDICATOR}?filters[0][name]=data-source&filters[0][operator]==&filters[0][values][0]=automated`,
        );

      expect(res.status).toBe(200);
      const chart = res.body.data.data.chart;
      expect(chart.map((c: { label: string }) => c.label)).toContain(
        OVERLAP_ANSWER,
      );
      // 2 rows on auto_test_ survey ids + 1 on an overlapping survey id.
      // Survey-level filtering would additionally pull that survey's own rows.
      expect(sumChart(chart)).toBe(3);
    });

    it('should split the chart per source, summing to the merged chart', async () => {
      const res = await testManager
        .request()
        .get(`/widgets/${TEST_INDICATOR}${bothSources}`);

      expect(res.status).toBe(200);
      const { chart, bySource } = res.body.data.data;

      expect(bySource).toHaveLength(2);
      expect(bySource.map((s: { source: string }) => s.source)).toEqual([
        'survey',
        'automated',
      ]);
      expect(
        sumChart(
          bySource.flatMap(
            (s: { data: { chart: { value: number }[] } }) => s.data.chart,
          ),
        ),
      ).toBe(sumChart(chart));
    });

    it('should give each source its own total, not the combined one', async () => {
      const res = await testManager
        .request()
        .get(`/widgets/${TEST_INDICATOR}${bothSources}`);

      const { chart, bySource } = res.body.data.data;
      const mergedTotal = chart[0].total;

      for (const { data } of bySource) {
        expect(data.chart[0].total).toBe(sumChart(data.chart));
        expect(data.chart[0].total).toBeLessThan(mergedTotal);
      }
    });

    it('should omit bySource when a single source is requested', async () => {
      const res = await testManager
        .request()
        .get(
          `/widgets/${TEST_INDICATOR}?filters[0][name]=data-source&filters[0][operator]==&filters[0][values][0]=survey`,
        );

      expect(res.status).toBe(200);
      expect(res.body.data.data.bySource).toBeUndefined();
    });

    it('should omit bySource when no data-source filter is sent', async () => {
      const res = await testManager
        .request()
        .get(`/widgets/${TEST_INDICATOR}`);

      expect(res.status).toBe(200);
      expect(res.body.data.data.bySource).toBeUndefined();
    });
  });
});
