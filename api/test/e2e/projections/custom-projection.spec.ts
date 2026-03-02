import { TestManager } from 'api/test/utils/test-manager';
import { projectionsContract as c } from '@shared/contracts/projections.contract';
import { CUSTOM_PROJECTION_SETTINGS } from '@shared/dto/projections/custom-projection-settings';
import { PROJECTION_VISUALIZATIONS } from '@shared/dto/projections/projection-visualizations.constants';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { ConfigurationParams } from '@shared/dto/global/configuration-params';

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
            vertical: 'market-potential',
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
              vertical: 'market-potential',
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

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });
});
