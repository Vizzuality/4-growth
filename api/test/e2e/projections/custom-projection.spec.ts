import { TestManager } from 'api/test/utils/test-manager';
import { projectionsContract as c } from '@shared/contracts/projections.contract';
import { CUSTOM_PROJECTION_SETTINGS } from '@shared/dto/projections/custom-projection-settings';
import { PROJECTION_VISUALIZATIONS } from '@shared/dto/projections/projection-visualizations.constants';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { ConfigurationParams } from '@shared/dto/global/configuration-params';
import { PROJECTION_TYPES } from '@shared/dto/projections/projection-types';

describe('Custom Projection API', () => {
  let testManager: TestManager<unknown>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
    await testManager.dataSource.getRepository(ConfigurationParams).clear();
    await testManager.getModule(DataSourceManager).loadInitialData();
  });

  test(`${c.getCustomProjectionSettings.path} should return the settings for a custom projection`, async () => {
    const res = await testManager
      .request()
      .get(c.getCustomProjectionSettings.path);

    expect(res.status).toBe(200);
    expect(res.body?.data).toStrictEqual(CUSTOM_PROJECTION_SETTINGS);
  });

  test(`${c.getCustomProjection.path} should return a custom projection when the settings are correct`, async () => {
    const res = await testManager
      .request()
      .get(c.getCustomProjection.path)
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
    const resData = res.body?.data;

    const unitKeys = Object.keys(resData);
    expect(unitKeys.length).toBeGreaterThan(0);

    const firstProjectionDataForUnit = resData[unitKeys[0]];
    expect(Array.isArray(firstProjectionDataForUnit)).toBe(true);
    expect(firstProjectionDataForUnit[0]).toHaveProperty('bubble');
    expect(firstProjectionDataForUnit[0]).toHaveProperty('color');
    expect(firstProjectionDataForUnit[0]).toHaveProperty('vertical');
    expect(firstProjectionDataForUnit[0]).toHaveProperty('horizontal');
    expect(firstProjectionDataForUnit[0]).toHaveProperty('size');
    expect(firstProjectionDataForUnit[0]).toHaveProperty('year');
  });

  test(`${c.getCustomProjection.path} should return a table custom projection with year/value data`, async () => {
    const res = await testManager
      .request()
      .get(c.getCustomProjection.path)
      .query({
        settings: {
          [PROJECTION_VISUALIZATIONS.TABLE]: {
            vertical: 'installed-base',
            color: 'country',
          },
        },
      });
    expect(res.status).toBe(200);
    const resData = res.body?.data;

    const unitKeys = Object.keys(resData);
    expect(unitKeys.length).toBeGreaterThan(0);

    const firstProjectionDataForUnit = resData[unitKeys[0]];
    expect(Array.isArray(firstProjectionDataForUnit)).toBe(true);
    expect(firstProjectionDataForUnit[0]).toHaveProperty('year');
    expect(firstProjectionDataForUnit[0]).toHaveProperty('value');
    expect(firstProjectionDataForUnit[0]).toHaveProperty('scenario');
    expect(firstProjectionDataForUnit[0]).toHaveProperty('technology');
    expect(firstProjectionDataForUnit[0]).toHaveProperty('technologyType');
    expect(firstProjectionDataForUnit[0]).toHaveProperty('country');
    expect(firstProjectionDataForUnit[0]).toHaveProperty('category');
    expect(firstProjectionDataForUnit[0]).not.toHaveProperty('color');
    expect(firstProjectionDataForUnit[0]).not.toHaveProperty('vertical');
  });

  test(`${c.getCustomProjection.path} should return an error when the settings for a custom projection are incorrect`, async () => {
    const res = await testManager
      .request()
      .get(c.getCustomProjection.path)
      .query({
        settings: {
          [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
            vertical: 'invalid_indicator',
          },
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  describe('Breakdown', () => {
    test(`${c.getCustomProjection.path} should return breakdown format for line chart with breakdown`, async () => {
      const res = await testManager
        .request()
        .get(c.getCustomProjection.path)
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
      const resData = res.body?.data;

      const unitKeys = Object.keys(resData);
      expect(unitKeys.length).toBeGreaterThan(0);

      const firstUnitData = resData[unitKeys[0]];
      expect(Array.isArray(firstUnitData)).toBe(true);
      expect(firstUnitData.length).toBeGreaterThan(0);

      // Each entry should have label (breakdown value) and data array
      const firstGroup = firstUnitData[0];
      expect(firstGroup).toHaveProperty('label');
      expect(firstGroup).toHaveProperty('data');
      expect(Array.isArray(firstGroup.data)).toBe(true);
      expect(firstGroup.data.length).toBeGreaterThan(0);

      // Each data entry should have label (year), value, and total
      const firstDataPoint = firstGroup.data[0];
      expect(firstDataPoint).toHaveProperty('label');
      expect(firstDataPoint).toHaveProperty('value');
      expect(firstDataPoint).toHaveProperty('total');

      // Should NOT have simple projection properties
      expect(firstGroup).not.toHaveProperty('year');
      expect(firstGroup).not.toHaveProperty('vertical');
      expect(firstGroup).not.toHaveProperty('color');
    });

    test(`${c.getCustomProjection.path} should return breakdown format for table with breakdown`, async () => {
      const res = await testManager
        .request()
        .get(c.getCustomProjection.path)
        .query({
          settings: {
            [PROJECTION_VISUALIZATIONS.TABLE]: {
              vertical: 'installed-base',
              color: 'country',
            },
          },
          breakdown: 'scenario',
        });

      expect(res.status).toBe(200);
      const resData = res.body?.data;

      const unitKeys = Object.keys(resData);
      expect(unitKeys.length).toBeGreaterThan(0);

      const firstUnitData = resData[unitKeys[0]];
      expect(Array.isArray(firstUnitData)).toBe(true);
      expect(firstUnitData.length).toBeGreaterThan(0);

      const firstGroup = firstUnitData[0];
      expect(firstGroup).toHaveProperty('label');
      expect(firstGroup).toHaveProperty('data');
      expect(Array.isArray(firstGroup.data)).toBe(true);

      const firstDataPoint = firstGroup.data[0];
      expect(firstDataPoint).toHaveProperty('label');
      expect(firstDataPoint).toHaveProperty('value');
      expect(firstDataPoint).toHaveProperty('total');
    });

    test(`${c.getCustomProjection.path} should return normal data when no breakdown is provided (regression)`, async () => {
      const res = await testManager
        .request()
        .get(c.getCustomProjection.path)
        .query({
          settings: {
            [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
              vertical: 'revenues',
              color: 'country',
            },
          },
        });

      expect(res.status).toBe(200);
      const resData = res.body?.data;

      const unitKeys = Object.keys(resData);
      expect(unitKeys.length).toBeGreaterThan(0);

      const firstUnitData = resData[unitKeys[0]];
      expect(Array.isArray(firstUnitData)).toBe(true);

      // Should have SimpleProjection shape
      const firstEntry = firstUnitData[0];
      expect(firstEntry).toHaveProperty('year');
      expect(firstEntry).toHaveProperty('vertical');
      expect(firstEntry).toHaveProperty('color');

      // Should NOT have breakdown shape
      expect(firstEntry).not.toHaveProperty('data');
    });

    test(`${c.getCustomProjection.path} should return 400 for invalid breakdown attribute`, async () => {
      const res = await testManager
        .request()
        .get(c.getCustomProjection.path)
        .query({
          settings: {
            [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
              vertical: 'revenues',
              color: 'country',
            },
          },
          breakdown: 'invalid-name',
        });

      expect(res.status).toBe(400);
    });

    test(`${c.getCustomProjection.path} should limit breakdown groups to max 10 (including Others)`, async () => {
      const res = await testManager
        .request()
        .get(c.getCustomProjection.path)
        .query({
          settings: {
            [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
              vertical: 'revenues',
              color: 'scenario',
            },
          },
          breakdown: 'country',
        });

      expect(res.status).toBe(200);
      const resData = res.body?.data;

      const unitKeys = Object.keys(resData);
      for (const unit of unitKeys) {
        expect(resData[unit].length).toBeLessThanOrEqual(10);
      }
    });
  });

  describe('Others Aggregation', () => {
    test(`${c.getCustomProjectionSettings.path} should not include othersAggregation when no color attribute is selected`, async () => {
      const res = await testManager
        .request()
        .get(c.getCustomProjectionSettings.path);

      expect(res.status).toBe(200);
      expect(res.body?.data.othersAggregation).toBeUndefined();
    });

    test(`${c.getCustomProjectionSettings.path} should not include othersAggregation when color attribute has few distinct values`, async () => {
      const res = await testManager
        .request()
        .get(
          `${c.getCustomProjectionSettings.path}?filters[0][name]=color&filters[0][operator]==&filters[0][values][0]=scenario`,
        );

      expect(res.status).toBe(200);
      expect(res.body?.data.othersAggregation).toBeUndefined();
    });

    test(`${c.getCustomProjectionSettings.path} should include othersAggregation when color attribute has many distinct values`, async () => {
      const res = await testManager
        .request()
        .get(
          `${c.getCustomProjectionSettings.path}?filters[0][name]=color&filters[0][operator]==&filters[0][values][0]=country`,
        );

      expect(res.status).toBe(200);
      expect(res.body?.data.othersAggregation).toStrictEqual([
        { value: 'visible', label: 'Visible' },
        { value: 'hidden', label: 'Hidden' },
      ]);
    });

    test(`${c.getCustomProjection.path} should not include "Others" entries when othersAggregation=hidden`, async () => {
      const res = await testManager
        .request()
        .get(c.getCustomProjection.path)
        .query({
          settings: {
            [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
              vertical: 'revenues',
              color: 'country',
            },
          },
          othersAggregation: 'hidden',
        });

      expect(res.status).toBe(200);
      const resData = res.body?.data;

      const unitKeys = Object.keys(resData);
      expect(unitKeys.length).toBeGreaterThan(0);

      for (const unit of unitKeys) {
        const colors = resData[unit].map(
          (entry: { color: string }) => entry.color,
        );
        expect(colors).not.toContain('Others');
      }
    });

    test(`${c.getCustomProjection.path} should include "Others" entries when othersAggregation=visible and data exceeds top 9`, async () => {
      const res = await testManager
        .request()
        .get(c.getCustomProjection.path)
        .query({
          settings: {
            [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
              vertical: 'revenues',
              color: 'country',
            },
          },
          othersAggregation: 'visible',
        });

      expect(res.status).toBe(200);
      const resData = res.body?.data;

      const unitKeys = Object.keys(resData);
      expect(unitKeys.length).toBeGreaterThan(0);

      // Check that distinct colors per unit don't exceed 10 (top 9 + Others)
      for (const unit of unitKeys) {
        const uniqueColors = [
          ...new Set(
            resData[unit].map((entry: { color: string }) => entry.color),
          ),
        ];
        expect(uniqueColors.length).toBeLessThanOrEqual(10);
      }
    });

    test(`${c.getCustomProjection.path} should not include "Others" in breakdown when othersAggregation=hidden`, async () => {
      const res = await testManager
        .request()
        .get(c.getCustomProjection.path)
        .query({
          settings: {
            [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
              vertical: 'revenues',
              color: 'scenario',
            },
          },
          breakdown: 'country',
          othersAggregation: 'hidden',
        });

      expect(res.status).toBe(200);
      const resData = res.body?.data;

      const unitKeys = Object.keys(resData);
      expect(unitKeys.length).toBeGreaterThan(0);

      for (const unit of unitKeys) {
        const labels = resData[unit].map(
          (entry: { label: string }) => entry.label,
        );
        expect(labels).not.toContain('Others');
      }
    });
  });

  test(`${c.getCustomProjection.path} penetration as vertical axis uses ratio formula, not plain SUM`, async () => {
    // Scope to baseline + one technology-type so there is exactly one color group per year.
    // Pick the first technology-type available in the DB.
    const techTypeRows: Array<{ technology_type: string }> =
      await testManager.dataSource.query(
        `SELECT DISTINCT technology_type FROM projections WHERE scenario = 'baseline' LIMIT 1`,
      );
    expect(techTypeRows.length).toBeGreaterThan(0);
    const techType = techTypeRows[0].technology_type;

    // Compute expected penetration for this (baseline, techType, year 2025) group
    const rawRatio: Array<{ ib: string; am: string }> =
      await testManager.dataSource.query(`
        SELECT
          SUM(CASE WHEN p.type = '${PROJECTION_TYPES.INSTALLED_BASE}' THEN pd.value END) AS ib,
          SUM(CASE WHEN p.type = '${PROJECTION_TYPES.ADDRESSABLE_MARKET}' THEN pd.value END) AS am
        FROM projections p
        JOIN projection_data pd ON pd.projection_id = p.id
        WHERE p.scenario = 'baseline'
          AND p.technology_type = '${techType}'
          AND pd.year = 2025
      `);
    const ib = Number(rawRatio[0].ib);
    const am = Number(rawRatio[0].am);
    expect(am).toBeGreaterThan(0);
    const expectedPenetration = (ib / am) * 100;

    const res = await testManager
      .request()
      .get(c.getCustomProjection.path)
      .query({
        settings: {
          [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
            vertical: PROJECTION_TYPES.PENETRATION,
            color: 'technology-type',
          },
        },
        'dataFilters[0][name]': 'scenario',
        'dataFilters[0][operator]': '=',
        'dataFilters[0][values][0]': 'baseline',
        'dataFilters[1][name]': 'technology-type',
        'dataFilters[1][operator]': '=',
        'dataFilters[1][values][0]': techType,
      });

    expect(res.status).toBe(200);
    const resData = res.body?.data as Record<string, Array<{ year: number; vertical: number; color: string }>>;

    // The result must be keyed by '%' (the penetration unit from the ratio config), not 'Units'
    expect(Object.keys(resData)).toContain('%');
    // One color group filtered → one entry per year
    const year2025 = resData['%']?.find((d) => d.year === 2025);
    expect(year2025).toBeDefined();
    // Value must match Σ IB / Σ AM × 100, not a plain SUM of penetration rows
    expect(year2025!.vertical).toBeCloseTo(expectedPenetration, 4);
  });

  describe('Others bucket aggregation', () => {
    test(`${c.getCustomProjection.path} Others penetration uses ratio formula (Σ IB / Σ AM), not SUM of per-color ratios`, async () => {
      // Find the top-9 countries by aggregate penetration ratio in the test DB.
      const top9Rows: Array<{ country: string }> = await testManager.dataSource.query(`
        SELECT p.country
        FROM projections p
        JOIN projection_data pd ON pd.projection_id = p.id
        WHERE p.scenario = 'baseline'
        GROUP BY p.country
        ORDER BY
          COALESCE(
            SUM(CASE WHEN p.type = '${PROJECTION_TYPES.INSTALLED_BASE}' THEN pd.value END)
            / NULLIF(SUM(CASE WHEN p.type = '${PROJECTION_TYPES.ADDRESSABLE_MARKET}' THEN pd.value END), 0),
            0
          ) DESC
        LIMIT 9
      `);

      // Compute expected Others value: Σ IB / Σ AM × 100 for countries outside the top 9.
      const top9Countries = top9Rows.map((r) => r.country);
      const othersRaw: Array<{ ib: string; am: string }> =
        await testManager.dataSource.query(
          `
          SELECT
            SUM(CASE WHEN p.type = '${PROJECTION_TYPES.INSTALLED_BASE}' THEN pd.value END) AS ib,
            SUM(CASE WHEN p.type = '${PROJECTION_TYPES.ADDRESSABLE_MARKET}' THEN pd.value END) AS am
          FROM projections p
          JOIN projection_data pd ON pd.projection_id = p.id
          WHERE p.scenario = 'baseline'
            AND pd.year = 2025
            AND p.country NOT IN (${top9Countries.map((_, i) => `$${i + 1}`).join(', ')})
        `,
          top9Countries,
        );

      const othersIb = Number(othersRaw[0].ib);
      const othersAm = Number(othersRaw[0].am);

      // Skip if there are fewer than 10 distinct countries in the test DB.
      if (top9Rows.length < 9 || othersAm === 0) {
        return;
      }

      const expectedOthersPenetration = (othersIb / othersAm) * 100;

      const res = await testManager
        .request()
        .get(c.getCustomProjection.path)
        .query({
          settings: {
            [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
              vertical: PROJECTION_TYPES.PENETRATION,
              color: 'country',
            },
          },
          'dataFilters[0][name]': 'scenario',
          'dataFilters[0][operator]': '=',
          'dataFilters[0][values][0]': 'baseline',
          othersAggregation: 'visible',
        });

      expect(res.status).toBe(200);
      const resData = res.body?.data as Record<
        string,
        Array<{ year: number; vertical: number; color: string }>
      >;
      expect(Object.keys(resData)).toContain('%');

      const othersEntry = resData['%']?.find(
        (d) => d.color === 'Others' && d.year === 2025,
      );
      expect(othersEntry).toBeDefined();
      expect(othersEntry!.vertical).toBeCloseTo(expectedOthersPenetration, 4);
    });

    test(`${c.getCustomProjection.path} Others installed-base uses SUM (non-ratio regression)`, async () => {
      const top9Rows: Array<{ country: string }> = await testManager.dataSource.query(`
        SELECT p.country
        FROM projections p
        JOIN projection_data pd ON pd.projection_id = p.id
        WHERE p.scenario = 'baseline' AND p.type = '${PROJECTION_TYPES.INSTALLED_BASE}'
        GROUP BY p.country
        ORDER BY SUM(pd.value) DESC
        LIMIT 9
      `);

      const top9Countries = top9Rows.map((r) => r.country);
      const othersRaw: Array<{ total: string }> =
        await testManager.dataSource.query(
          `
          SELECT SUM(pd.value) AS total
          FROM projections p
          JOIN projection_data pd ON pd.projection_id = p.id
          WHERE p.scenario = 'baseline'
            AND p.type = '${PROJECTION_TYPES.INSTALLED_BASE}'
            AND pd.year = 2025
            AND p.country NOT IN (${top9Countries.map((_, i) => `$${i + 1}`).join(', ')})
        `,
          top9Countries,
        );

      if (top9Rows.length < 9 || !othersRaw[0].total) {
        return;
      }

      const expectedOthersIb = Number(othersRaw[0].total);

      const res = await testManager
        .request()
        .get(c.getCustomProjection.path)
        .query({
          settings: {
            [PROJECTION_VISUALIZATIONS.LINE_CHART]: {
              vertical: PROJECTION_TYPES.INSTALLED_BASE,
              color: 'country',
            },
          },
          'dataFilters[0][name]': 'scenario',
          'dataFilters[0][operator]': '=',
          'dataFilters[0][values][0]': 'baseline',
          othersAggregation: 'visible',
        });

      expect(res.status).toBe(200);
      const resData = res.body?.data as Record<
        string,
        Array<{ year: number; vertical: number; color: string }>
      >;

      const othersEntry = Object.values(resData)
        .flat()
        .find((d) => d.color === 'Others' && d.year === 2025);
      expect(othersEntry).toBeDefined();
      expect(othersEntry!.vertical).toBeCloseTo(expectedOthersIb, 4);
    });
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });
});
