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

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });
});
