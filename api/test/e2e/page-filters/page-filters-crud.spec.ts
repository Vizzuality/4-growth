import { QuestionIndicatorMap } from '@shared/dto/surveys/question-widget-map.entity';
import { PageFilter } from '@shared/dto/widgets/page-filter.entity';
import { TestManager } from 'api/test/utils/test-manager';

describe('Page Filters API', () => {
  let testManager: TestManager<unknown>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
  });

  afterAll(async () => {
    await testManager.close();
  });

  it('Should allow users to retrieve all page filters', async () => {
    // Given
    const pageFiltersRepo = testManager.dataSource.getRepository(PageFilter);

    const questionIndicatorMapRepo =
      testManager.dataSource.getRepository(QuestionIndicatorMap);

    await questionIndicatorMapRepo.save({
      question: 'test-question',
      indicator: 'test-indicator',
    });
    await pageFiltersRepo.save({
      name: 'test-indicator',
      values: ['Value 1', 'Value 2'],
      label: 'Test Indicator',
    });

    // When
    const res = await testManager.request().get('/filters');

    // Then
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // it('Should allow users to retrieve page filters dynamically depending on the filters applied', async () => {
  //   // Given
  //   const filters = [
  //     {
  //       name: 'sector',
  //       operator: SEARCH_FILTERS_OPERATORS.EQUALS,
  //       values: ['Forestry'],
  //     },
  //     {
  //       name: 'location-country-region',
  //       operator: SEARCH_FILTERS_OPERATORS.EQUALS,
  //       values: ['Spain'],
  //     },
  //   ];
  //   const queryString = qs.stringify({ filters }, { encode: false });

  //   // When
  //   const res = await testManager.request().get(`/filters?${queryString}`);

  //   // Then
  //   expect(res.status).toBe(200);
  //   expect(res.body.data.length).toBeGreaterThan(0);

  //   const sectorFilterValues = res.body.data.find(
  //     (filter: { name: string }) => filter.name === 'sector',
  //   );
  //   expect(sectorFilterValues.values).toHaveLength(1);
  //   expect(sectorFilterValues.values.includes('Forestry')).toBe(true);

  //   const locationFilterValues = res.body.data.find(
  //     (filter: { name: string }) => filter.name === 'location-country-region',
  //   );
  //   expect(locationFilterValues.values).toHaveLength(1);
  //   expect(locationFilterValues.values.includes('Spain')).toBe(true);
  // });
});
