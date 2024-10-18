import { QueryFailedError, Repository } from 'typeorm';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { TestManager } from 'api/test/utils/test-manager';
import { SurveyAnswer } from '@shared/dto/surveys/survey-answer.entity';

describe('SurveyAnswerRepository', () => {
  let testManager: TestManager<unknown>;
  let dataSourceManager: DataSourceManager;

  let surveyAnswerRepository: Repository<SurveyAnswer>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({
      logger: false,
      initialize: false,
    });
    dataSourceManager = testManager.testApp.get(DataSourceManager);

    const dataSource = testManager.getDataSource();
    surveyAnswerRepository = dataSource.getRepository(SurveyAnswer);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  it('should should throw an error when a base widget is created with an invalid question->indicator combination', async () => {
    // Given
    await dataSourceManager.loadQuestionIndicatorMap();

    // When
    let surveyAnswer;
    let error;
    try {
      surveyAnswer = await surveyAnswerRepository.save({
        surveyId: '1',
        questionIndicator: 'invalid-question-indicat',
        question: 'invalid-question',
        answer: 'answer',
        countryCode: 'ESP',
      });
    } catch (err) {
      error = err;
    }

    // Then
    expect(surveyAnswer).toBeUndefined();
    expect(error).toBeInstanceOf(QueryFailedError);
    expect(error.severity).toBe('ERROR');
    expect(error.constraint).toBe('FK_question_indicator_map');
  });
});
