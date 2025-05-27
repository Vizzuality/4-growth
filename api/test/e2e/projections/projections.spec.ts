import { TestManager } from 'api/test/utils/test-manager';
import { projectionsContract as c } from '@shared/contracts/projections.contract';

describe('Projections API', () => {
  let testManager: TestManager<unknown>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
  });

  test(`${c.getProjectionsFilters.path} should return dynamic filters depending on the provided 'filters' param`, async () => {
    const allFiltersReq = await testManager
      .request()
      .get(c.getProjectionsFilters.path);

    expect(allFiltersReq.status).toBe(200);
    const allFiltersReqData = allFiltersReq.body.data;
    expect(allFiltersReqData).toBeDefined();
    expect(allFiltersReqData[0].name).toBeDefined();
    expect(Array.isArray(allFiltersReqData[0].values)).toBe(true);

    const reqWithFilterParams = await testManager
      .request()
      .get(
        `${c.getProjectionsFilters.path}?filters[0][name]=application&filters[0][operator]==&filters[0][values][0]=Agricultural machinery and equipment services`,
      );

    expect(reqWithFilterParams.status).toBe(200);
    const reqWithFilterParamsData = reqWithFilterParams.body.data;
    expect(reqWithFilterParamsData).toBeDefined();
    expect(reqWithFilterParamsData[0].name).toBeDefined();
    expect(Array.isArray(reqWithFilterParamsData[0].values)).toBe(true);
    expect(
      Buffer.byteLength(JSON.stringify(reqWithFilterParamsData)),
    ).toBeLessThan(Buffer.byteLength(JSON.stringify(allFiltersReqData)));
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
