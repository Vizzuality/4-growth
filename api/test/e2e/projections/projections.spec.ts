import { TestManager } from 'api/test/utils/test-manager';
import { projectionsContract as c } from '@shared/contracts/projections.contract';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';

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

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });
});
