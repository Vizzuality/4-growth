import { TestManager } from 'api/test/utils/test-manager';
import { projectionsContract as c } from '@shared/contracts/projections.contract';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { PROJECTION_TYPES } from '@shared/dto/projections/projection-types';

describe('Projections API', () => {
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

  // Dynamic filters functionality has been removed - commenting out this test
  // test(`${c.getProjectionsFilters.path} should return dynamic filters depending on the provided 'filters' param`, async () => {
  //   const allFiltersReq = await testManager
  //     .request()
  //     .get(c.getProjectionsFilters.path);

  //   expect(allFiltersReq.status).toBe(200);
  //   const allFiltersReqData = allFiltersReq.body.data;
  //   expect(allFiltersReqData).toBeDefined();
  //   expect(allFiltersReqData[0].name).toBeDefined();
  //   expect(Array.isArray(allFiltersReqData[0].values)).toBe(true);

  //   const reqWithFilterParams = await testManager
  //     .request()
  //     .get(
  //       `${c.getProjectionsFilters.path}?filters[0][name]=application&filters[0][operator]==&filters[0][values][0]=Agricultural machinery and equipment services`,
  //     );

  //   expect(reqWithFilterParams.status).toBe(200);
  //   const reqWithFilterParamsData = reqWithFilterParams.body.data;
  //   expect(reqWithFilterParamsData).toBeDefined();
  //   expect(reqWithFilterParamsData[0].name).toBeDefined();
  //   expect(Array.isArray(reqWithFilterParamsData[0].values)).toBe(true);
  //   expect(
  //     Buffer.byteLength(JSON.stringify(reqWithFilterParamsData)),
  //   ).toBeLessThan(Buffer.byteLength(JSON.stringify(allFiltersReqData)));
  // });

  test(`${c.getProjectionsFilters.path} should return all projection filters when no operation area is provided`, async () => {
    const filtersReq = await testManager
      .request()
      .get(c.getProjectionsFilters.path);

    expect(filtersReq.status).toBe(200);
    const filtersData = filtersReq.body.data;
    expect(filtersData).toBeDefined();
    expect(Array.isArray(filtersData)).toBe(true);

    if (filtersData.length > 0) {
      expect(filtersData[0].name).toBeDefined();
      expect(typeof filtersData[0].name).toBe('string');
      expect(filtersData[0].label).toBeDefined();
      expect(typeof filtersData[0].label).toBe('string');
      expect(Array.isArray(filtersData[0].values)).toBe(true);
    }

    // Non-category filters must not affect the response
    const filtersReqWithOtherParams = await testManager
      .request()
      .get(
        `${c.getProjectionsFilters.path}?filters[0][name]=scenario&filters[0][operator]==&filters[0][values][0]=baseline`,
      );
    expect(filtersReqWithOtherParams.status).toBe(200);
    expect(filtersReqWithOtherParams.body.data).toEqual(filtersData);
  });

  test(`${c.getProjectionsFilters.path} should scope technology and technology-type lists to the selected operation area`, async () => {
    const allFiltersReq = await testManager
      .request()
      .get(c.getProjectionsFilters.path);
    expect(allFiltersReq.status).toBe(200);
    const allFilters: { name: string; values: string[] }[] =
      allFiltersReq.body.data;

    const agricultureReq = await testManager
      .request()
      .get(
        `${c.getProjectionsFilters.path}?filters[0][name]=category&filters[0][operator]==&filters[0][values][0]=Agriculture`,
      );
    expect(agricultureReq.status).toBe(200);
    const agricultureFilters: { name: string; values: string[] }[] =
      agricultureReq.body.data;

    // Response must have the same filter names
    expect(agricultureFilters.map((f) => f.name)).toEqual(
      allFilters.map((f) => f.name),
    );

    const allTechValues = allFilters.find((f) => f.name === 'technology')!.values;
    const agriTechValues = agricultureFilters.find(
      (f) => f.name === 'technology',
    )!.values;
    // Agriculture technologies must be a subset of the combined list
    expect(agriTechValues.length).toBeLessThan(allTechValues.length);
    agriTechValues.forEach((v) => expect(allTechValues).toContain(v));

    const allTechTypeValues = allFilters.find(
      (f) => f.name === 'technology-type',
    )!.values;
    const agriTechTypeValues = agricultureFilters.find(
      (f) => f.name === 'technology-type',
    )!.values;
    // Agriculture technology-types must be a subset and must not contain forestry-only values
    agriTechTypeValues.forEach((v) => expect(allTechTypeValues).toContain(v));
    expect(agriTechTypeValues).not.toContain('Satellite Imagery');

    // Country and unit lists must be unchanged
    const getValues = (
      list: { name: string; values: string[] }[],
      name: string,
    ) => list.find((f) => f.name === name)!.values;
    expect(getValues(agricultureFilters, 'country')).toEqual(
      getValues(allFilters, 'country'),
    );
    expect(getValues(agricultureFilters, 'unit')).toEqual(
      getValues(allFilters, 'unit'),
    );
  });

  test(`${c.getProjectionsWidgets.path} should return projections depending on the provided 'filters'  and 'dataFilters' params`, async () => {
    const allFiltersReq = await testManager
      .request()
      .get(c.getProjectionsWidgets.path);

    expect(allFiltersReq.status).toBe(200);
    const allFiltersReqData = allFiltersReq.body.data;
    expect(allFiltersReqData).toBeDefined();

    const reqWithFilterParams = await testManager
      .request()
      .get(
        `${c.getProjectionsWidgets.path}?filters[0][name]=type&filters[0][operator]==&filters[0][values][0]=penetration&dataFilters[0][name]=technology-type&dataFilters[0][operator]==&dataFilters[0][values][0]=Hardware`,
      );

    expect(reqWithFilterParams.status).toBe(200);
    const reqWithFilterParamsData = reqWithFilterParams.body.data;
    expect(reqWithFilterParamsData).toBeDefined();
    expect(
      Buffer.byteLength(JSON.stringify(reqWithFilterParamsData)),
    ).toBeLessThan(Buffer.byteLength(JSON.stringify(allFiltersReqData)));
  });

  test(`${c.getProjectionsWidgets.path} returns exactly 6 widgets, none of type market-potential`, async () => {
    const res = await testManager.request().get(c.getProjectionsWidgets.path);
    expect(res.status).toBe(200);
    const widgets = res.body.data as Array<{ id: number; type: string }>;
    expect(widgets).toHaveLength(6);
    const types = widgets.map((w) => w.type).sort();
    expect(types).toEqual([
      'addressable-market',
      'installed-base',
      'penetration',
      'prices',
      'revenues',
      'shipments',
    ]);
    expect(widgets.map((w) => w.id).sort((a, b) => a - b)).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
  });

  test(`${c.getProjectionsFilters.path} returns both categories and all four D3.4 scenarios`, async () => {
    const res = await testManager.request().get(c.getProjectionsFilters.path);
    expect(res.status).toBe(200);
    const filters = res.body.data as Array<{ name: string; values: string[] }>;

    const categoryValues = filters.find((f) => f.name === 'category')!.values;
    expect([...categoryValues].sort()).toEqual(['Agriculture', 'Forestry']);

    const scenarioValues = filters.find((f) => f.name === 'scenario')!.values;
    expect([...scenarioValues].sort()).toEqual([
      'baseline',
      'reimagining_progress',
      'the_corporate_epoch',
      'the_fractured_continent',
    ]);
  });

  test('Penetration widget uses ratio formula (Σ Installed Base / Σ Addressable Market × 100)', async () => {
    // Compute the expected value from raw DB data for a concrete year
    const rawRatio: Array<{ ib: string; am: string }> =
      await testManager.dataSource.query(`
        SELECT
          SUM(CASE WHEN p.type = '${PROJECTION_TYPES.INSTALLED_BASE}' THEN pd.value END) AS ib,
          SUM(CASE WHEN p.type = '${PROJECTION_TYPES.ADDRESSABLE_MARKET}' THEN pd.value END) AS am
        FROM projections p
        JOIN projection_data pd ON pd.projection_id = p.id
        WHERE p.scenario = 'baseline' AND pd.year = 2025
      `);
    const ib = Number(rawRatio[0].ib);
    const am = Number(rawRatio[0].am);
    expect(am).toBeGreaterThan(0);
    const expectedPenetration = (ib / am) * 100;

    const res = await testManager
      .request()
      .get(c.getProjectionsWidgets.path)
      .query({
        'filters[0][name]': 'type',
        'filters[0][operator]': '=',
        'filters[0][values][0]': PROJECTION_TYPES.PENETRATION,
        'dataFilters[0][name]': 'scenario',
        'dataFilters[0][operator]': '=',
        'dataFilters[0][values][0]': 'baseline',
      });

    expect(res.status).toBe(200);
    const penetrationWidget = (res.body.data as Array<{ type: string; data: Record<string, Array<{ year: number; value: number }>> }>).find(
      (w) => w.type === PROJECTION_TYPES.PENETRATION,
    );
    expect(penetrationWidget).toBeDefined();
    expect(penetrationWidget!.data).toBeDefined();
    const seriesForYear = penetrationWidget!.data['%']?.find((d) => d.year === 2025);
    expect(seriesForYear).toBeDefined();
    expect(seriesForYear!.value).toBeCloseTo(expectedPenetration, 4);
  });

  test('Prices widget uses ratio formula (Σ Revenues / Σ Shipments)', async () => {
    const rawRatio: Array<{ rev: string; ship: string }> =
      await testManager.dataSource.query(`
        SELECT
          SUM(CASE WHEN p.type = '${PROJECTION_TYPES.REVENUES}' THEN pd.value END) AS rev,
          SUM(CASE WHEN p.type = '${PROJECTION_TYPES.SHIPMENTS}' THEN pd.value END) AS ship
        FROM projections p
        JOIN projection_data pd ON pd.projection_id = p.id
        WHERE p.scenario = 'baseline' AND pd.year = 2025
      `);
    const rev = Number(rawRatio[0].rev);
    const ship = Number(rawRatio[0].ship);
    expect(ship).toBeGreaterThan(0);
    const expectedPrice = rev / ship;

    const res = await testManager
      .request()
      .get(c.getProjectionsWidgets.path)
      .query({
        'filters[0][name]': 'type',
        'filters[0][operator]': '=',
        'filters[0][values][0]': PROJECTION_TYPES.PRICES,
        'dataFilters[0][name]': 'scenario',
        'dataFilters[0][operator]': '=',
        'dataFilters[0][values][0]': 'baseline',
      });

    expect(res.status).toBe(200);
    const pricesWidget = (res.body.data as Array<{ type: string; data: Record<string, Array<{ year: number; value: number }>> }>).find(
      (w) => w.type === PROJECTION_TYPES.PRICES,
    );
    expect(pricesWidget).toBeDefined();
    const seriesForYear = pricesWidget!.data['EUR']?.find((d) => d.year === 2025);
    expect(seriesForYear).toBeDefined();
    expect(seriesForYear!.value).toBeCloseTo(expectedPrice, 4);
  });

  test('Non-ratio widgets (Addressable Market, Shipments) still return SUM values', async () => {
    const rawSum: Array<{ am_sum: string; ship_sum: string }> =
      await testManager.dataSource.query(`
        SELECT
          SUM(CASE WHEN p.type = '${PROJECTION_TYPES.ADDRESSABLE_MARKET}' THEN pd.value END) AS am_sum,
          SUM(CASE WHEN p.type = '${PROJECTION_TYPES.SHIPMENTS}' THEN pd.value END) AS ship_sum
        FROM projections p
        JOIN projection_data pd ON pd.projection_id = p.id
        WHERE p.scenario = 'baseline' AND pd.year = 2025
      `);
    const expectedAM = Number(rawSum[0].am_sum);
    const expectedShipments = Number(rawSum[0].ship_sum);

    const res = await testManager
      .request()
      .get(c.getProjectionsWidgets.path)
      .query({
        'dataFilters[0][name]': 'scenario',
        'dataFilters[0][operator]': '=',
        'dataFilters[0][values][0]': 'baseline',
      });
    expect(res.status).toBe(200);
    const widgets = res.body.data as Array<{ type: string; data: Record<string, Array<{ year: number; value: number }>> }>;

    const amWidget = widgets.find((w) => w.type === PROJECTION_TYPES.ADDRESSABLE_MARKET)!;
    const amForYear = amWidget.data['Units']?.find((d) => d.year === 2025);
    expect(amForYear!.value).toBeCloseTo(expectedAM, 4);

    const shipWidget = widgets.find((w) => w.type === PROJECTION_TYPES.SHIPMENTS)!;
    const shipForYear = shipWidget.data['Units']?.find((d) => d.year === 2025);
    expect(shipForYear!.value).toBeCloseTo(expectedShipments, 4);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });
});
