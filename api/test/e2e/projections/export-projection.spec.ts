import { TestManager } from 'api/test/utils/test-manager';
import { projectionsContract as c } from '@shared/contracts/projections.contract';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { PROJECTION_VISUALIZATIONS } from '@shared/dto/projections/projection-visualizations.constants';
import { parse } from 'csv-parse/sync';

describe('Projections CSV export', () => {
  let testManager: TestManager<unknown>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
    const dsm = testManager.getModule(DataSourceManager);
    await dsm.loadProjectionTypes();
    await dsm.loadProjections();
    await Promise.all([
      dsm.generateProjectionsWidgets(),
      dsm.generateProjectionsFilters(),
      dsm.generateProjectionsSettings(),
    ]);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  describe('GET /projections/custom-widget/export', () => {
    it('returns 200 with text/csv and a dated attachment filename', async () => {
      const res = await testManager
        .request()
        .get(c.exportCustomProjection.path)
        .query({
          settings: {
            [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
              vertical: 'revenues',
              color: 'country',
            },
          },
        });

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.headers['content-disposition']).toMatch(
        /^attachment; filename="custom-projection-\d{4}-\d{2}-\d{2}\.csv"$/,
      );
    });

    it('serializes a simple (line chart) projection with unit,year,vertical,color columns', async () => {
      const res = await testManager
        .request()
        .get(c.exportCustomProjection.path)
        .query({
          settings: {
            [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
              vertical: 'revenues',
              color: 'country',
            },
          },
        });

      expect(res.status).toBe(200);
      const rows = parse(res.text, { columns: true });
      expect(rows.length).toBeGreaterThan(0);
      expect(Object.keys(rows[0]).sort()).toEqual(
        ['unit', 'year', 'vertical', 'color'].sort(),
      );
    });

    it('serializes a bubble projection with all dimensional columns', async () => {
      const res = await testManager
        .request()
        .get(c.exportCustomProjection.path)
        .query({
          settings: {
            [PROJECTION_VISUALIZATIONS.BUBBLE_CHART]: {
              bubble: 'technology-type',
              vertical: 'revenues',
              horizontal: 'addressable-market',
              size: 'penetration',
              color: 'country',
            },
          },
        });

      expect(res.status).toBe(200);
      const rows = parse(res.text, { columns: true });
      expect(rows.length).toBeGreaterThan(0);
      expect(Object.keys(rows[0]).sort()).toEqual(
        [
          'unit',
          'year',
          'bubble',
          'color',
          'vertical',
          'horizontal',
          'size',
        ].sort(),
      );
    });

    it('serializes a table projection with technology_type (snake_case) and other columns', async () => {
      const res = await testManager
        .request()
        .get(c.exportCustomProjection.path)
        .query({
          settings: {
            [PROJECTION_VISUALIZATIONS.TABLE]: {
              vertical: 'installed-base',
              color: 'country',
            },
          },
        });

      expect(res.status).toBe(200);
      const rows = parse(res.text, { columns: true });
      expect(rows.length).toBeGreaterThan(0);
      expect(Object.keys(rows[0]).sort()).toEqual(
        [
          'unit',
          'year',
          'value',
          'scenario',
          'technology',
          'technology_type',
          'country',
          'category',
        ].sort(),
      );
    });

    it('serializes a breakdown projection in long format', async () => {
      const res = await testManager
        .request()
        .get(c.exportCustomProjection.path)
        .query({
          settings: {
            [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
              vertical: 'revenues',
              color: 'country',
            },
          },
          breakdown: 'technology',
        });

      expect(res.status).toBe(200);
      const rows = parse(res.text, { columns: true });
      expect(rows.length).toBeGreaterThan(0);
      expect(Object.keys(rows[0]).sort()).toEqual(
        ['unit', 'breakdown_label', 'label', 'value', 'total'].sort(),
      );
    });

    it('returns 400 when the settings are invalid', async () => {
      const res = await testManager
        .request()
        .get(c.exportCustomProjection.path)
        .query({
          settings: {
            [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
              vertical: 'invalid_indicator',
            },
          },
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /projections/widgets/:id/export', () => {
    it('returns 404 for an unknown widget id', async () => {
      const res = await testManager
        .request()
        .get('/projections/widgets/999999/export');
      expect(res.status).toBe(404);
    });

    it('exports an existing projection widget as CSV with unit,year,value columns', async () => {
      const listRes = await testManager
        .request()
        .get(c.getProjectionsWidgets.path);
      expect(listRes.status).toBe(200);
      const widgets = listRes.body.data as Array<{ id: number }>;
      expect(widgets.length).toBeGreaterThan(0);
      const widgetId = widgets[0].id;

      const res = await testManager
        .request()
        .get(`/projections/widgets/${widgetId}/export`);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.headers['content-disposition']).toMatch(
        /^attachment; filename=".+-\d{4}-\d{2}-\d{2}\.csv"$/,
      );
      const rows = parse(res.text, { columns: true });
      expect(rows.length).toBeGreaterThan(0);
      expect(Object.keys(rows[0]).sort()).toEqual(
        ['unit', 'year', 'value'].sort(),
      );
    });

    it('applies dataFilters to the exported data', async () => {
      const listRes = await testManager
        .request()
        .get(c.getProjectionsWidgets.path);
      const widgetId = (listRes.body.data as Array<{ id: number }>)[0].id;

      const exportForCategory = (category: string) =>
        testManager
          .request()
          .get(
            `/projections/widgets/${widgetId}/export?dataFilters[0][name]=category&dataFilters[0][operator]==&dataFilters[0][values][0]=${category}`,
          );

      const [forestry, agriculture, unfiltered] = await Promise.all([
        exportForCategory('Forestry'),
        exportForCategory('Agriculture'),
        testManager.request().get(`/projections/widgets/${widgetId}/export`),
      ]);

      expect(forestry.status).toBe(200);
      expect(agriculture.status).toBe(200);
      expect(unfiltered.status).toBe(200);

      // Aggregates are float8 sums, so identical requests differ in the last
      // decimals. Compare magnitudes, not CSV text.
      const firstYearValue = (csv: string): number => {
        const rows = parse(csv, { columns: true }) as Array<{ value: string }>;
        return Number(rows[0].value);
      };
      const relativeDiff = (a: number, b: number): number =>
        Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b));

      const forestryValue = firstYearValue(forestry.text);
      const agricultureValue = firstYearValue(agriculture.text);
      const unfilteredValue = firstYearValue(unfiltered.text);

      expect(forestryValue).toBeGreaterThan(0);
      expect(agricultureValue).toBeGreaterThan(0);
      expect(relativeDiff(forestryValue, agricultureValue)).toBeGreaterThan(
        0.01,
      );
      expect(relativeDiff(forestryValue, unfilteredValue)).toBeGreaterThan(0.01);
    });
  });
});
