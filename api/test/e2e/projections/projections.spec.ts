import { TestManager } from 'api/test/utils/test-manager';
import { projectionsContract as c } from '@shared/contracts/projections.contract';

describe('Projections API', () => {
  let testManager: TestManager<unknown>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
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

  test(`${c.getProjectionsFilters.path} should return static projection filters`, async () => {
    const filtersReq = await testManager
      .request()
      .get(c.getProjectionsFilters.path);

    expect(filtersReq.status).toBe(200);
    const filtersData = filtersReq.body.data;
    expect(filtersData).toBeDefined();
    expect(Array.isArray(filtersData)).toBe(true);

    // Verify each filter has the expected structure
    if (filtersData.length > 0) {
      expect(filtersData[0].name).toBeDefined();
      expect(typeof filtersData[0].name).toBe('string');
      expect(filtersData[0].label).toBeDefined();
      expect(typeof filtersData[0].label).toBe('string');
      expect(Array.isArray(filtersData[0].values)).toBe(true);
    }

    // Test that filters parameter doesn't affect the response (static filters)
    const filtersReqWithParams = await testManager
      .request()
      .get(
        `${c.getProjectionsFilters.path}?filters[0][name]=application&filters[0][operator]==&filters[0][values][0]=test`,
      );

    expect(filtersReqWithParams.status).toBe(200);
    const filtersDataWithParams = filtersReqWithParams.body.data;

    // Static filters should return the same data regardless of filter parameters
    expect(filtersDataWithParams).toEqual(filtersData);
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

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });
});
