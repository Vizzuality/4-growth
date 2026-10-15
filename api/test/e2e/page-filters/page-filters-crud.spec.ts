import { QuestionIndicatorMap } from '@shared/dto/surveys/question-widget-map.entity';
import { PageFilter } from '@shared/dto/widgets/page-filter.entity';
import { SurveyAnswer } from '@shared/dto/surveys/survey-answer.entity';
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

  describe.each([
    ['without filters', '/filters'],
    [
      'with filters',
      '/filters?filters[0][name]=data-source&filters[0][operator]==&filters[0][values][0]=survey',
    ],
  ])('GET /filters %s', (scope, url) => {
    const seedFilterWithAnswers = async (
      indicator: string,
      seededValues: string[],
      answers: string[],
    ) => {
      const question = `${indicator}-question`;
      await testManager.dataSource
        .getRepository(QuestionIndicatorMap)
        .save({ question, indicator });
      await testManager.dataSource
        .getRepository(PageFilter)
        .save({ name: indicator, values: seededValues, label: indicator });
      await testManager.dataSource.getRepository(SurveyAnswer).save(
        answers.map((answer, i) => ({
          surveyId: `${indicator}-survey-${i}`,
          questionIndicator: indicator,
          question,
          answer,
          countryCode: 'ESP',
        })),
      );
    };

    const getFilterValues = async (indicator: string) => {
      const res = await testManager.request().get(url);
      expect(res.status).toBe(200);
      return res.body.data.find((f: PageFilter) => f.name === indicator)
        ?.values;
    };

    it('offers the answers present in the data, not the seeded labels', async () => {
      const indicator = `stale-seed-${scope.replace(' ', '-')}`;
      await seedFilterWithAnswers(indicator, ['Old label'], ['New A', 'New B']);

      expect(await getFilterValues(indicator)).toEqual(['New A', 'New B']);
    });

    it('orders seeded values first, then unseeded values alphabetically', async () => {
      const indicator = `order-hint-${scope.replace(' ', '-')}`;
      await seedFilterWithAnswers(indicator, ['Z', 'B'], ['A', 'B', 'Z']);

      expect(await getFilterValues(indicator)).toEqual(['Z', 'B', 'A']);
    });
  });
});
