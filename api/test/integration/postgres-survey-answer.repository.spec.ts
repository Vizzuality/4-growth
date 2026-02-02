import { QueryFailedError, Repository } from 'typeorm';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { TestManager } from 'api/test/utils/test-manager';
import { SurveyAnswer } from '@shared/dto/surveys/survey-answer.entity';
import { PostgresSurveyAnswerRepository } from '@api/infrastructure/postgres-survey-answers.repository';
import {
  ISurveyAnswerRepository,
  SurveyAnswerRepository,
} from '@api/infrastructure/survey-answer-repository.interface';
import { BaseWidgetWithData } from '@shared/dto/widgets/base-widget-data.interface';
import { WIDGET_VISUALIZATIONS } from '@shared/dto/widgets/widget-visualizations.constants';

describe('PostgresSurveyAnswerRepository', () => {
  let testManager: TestManager<unknown>;
  let dataSourceManager: DataSourceManager;

  let surveyAnswerRepository: Repository<SurveyAnswer> &
    typeof PostgresSurveyAnswerRepository;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({
      logger: false,
      initialize: false,
    });
    dataSourceManager = testManager.testApp.get(DataSourceManager);

    const dataSource = testManager.getDataSource();
    surveyAnswerRepository = dataSource
      .getRepository(SurveyAnswer)
      .extend(PostgresSurveyAnswerRepository);
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

describe('PostgresSurveyAnswerRepository - Map Data', () => {
  let testManager: TestManager<unknown>;
  let dataSourceManager: DataSourceManager;
  let surveyAnswerRepo: ISurveyAnswerRepository;

  const TEST_INDICATOR = 'test-map-indicator';

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
    dataSourceManager = testManager.getModule(DataSourceManager);
    surveyAnswerRepo = testManager.getModule<ISurveyAnswerRepository>(
      SurveyAnswerRepository,
    );
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  it('should include ALB in map data when Albania has survey answers', async () => {
    // Given: question-indicator map and survey answers for ALB
    await testManager
      .mocks()
      .ensureQuestionIndicatorMapExists(testManager.getDataSource(), {
        indicator: TEST_INDICATOR,
        question: 'Test question for map',
      });

    const answersRepo = testManager.getDataSource().getRepository(SurveyAnswer);
    await answersRepo.save([
      {
        surveyId: 'alb-1',
        questionIndicator: TEST_INDICATOR,
        question: 'Test question for map',
        answer: 'Yes',
        countryCode: 'ALB',
      },
      {
        surveyId: 'alb-2',
        questionIndicator: TEST_INDICATOR,
        question: 'Test question for map',
        answer: 'No',
        countryCode: 'ALB',
      },
      {
        surveyId: 'alb-3',
        questionIndicator: TEST_INDICATOR,
        question: 'Test question for map',
        answer: 'Yes',
        countryCode: 'ALB',
      },
    ]);

    const widget: BaseWidgetWithData = {
      indicator: TEST_INDICATOR,
      visualisations: [WIDGET_VISUALIZATIONS.MAP],
      defaultVisualization: WIDGET_VISUALIZATIONS.MAP,
      data: {},
      responseRate: 0,
      absoluteValue: 0,
    } as BaseWidgetWithData;

    // When
    await surveyAnswerRepo.addSurveyDataToBaseWidget(widget, {});

    // Then
    expect(widget.data.map).toBeDefined();
    const albEntry = widget.data.map.find((entry) => entry.country === 'ALB');
    expect(albEntry).toBeDefined();
    // 2 Yes out of 3 total = 66.67%
    expect(Number(albEntry.value)).toBeCloseTo(66.67, 0);
  });

  it('should return chart and map data for adoption-of-technology-by-country indicator directly', async () => {
    const INDICATOR = 'adoption-of-technology-by-country';

    await testManager
      .mocks()
      .ensureQuestionIndicatorMapExists(testManager.getDataSource(), {
        indicator: INDICATOR,
        question: 'Has your organisation integrated digital technologies?',
      });

    const answersRepo = testManager.getDataSource().getRepository(SurveyAnswer);
    await answersRepo.save([
      {
        surveyId: 'adopt-1',
        questionIndicator: INDICATOR,
        question: 'Has your organisation integrated digital technologies?',
        answer: 'Yes',
        countryCode: 'ESP',
      },
      {
        surveyId: 'adopt-2',
        questionIndicator: INDICATOR,
        question: 'Has your organisation integrated digital technologies?',
        answer: 'No',
        countryCode: 'ESP',
      },
    ]);

    const widget: BaseWidgetWithData = {
      indicator: INDICATOR,
      visualisations: [
        WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART,
        WIDGET_VISUALIZATIONS.MAP,
      ],
      defaultVisualization: WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART,
      data: {},
      responseRate: 0,
      absoluteValue: 0,
    } as BaseWidgetWithData;

    await surveyAnswerRepo.addSurveyDataToBaseWidget(widget, {});

    expect(widget.data.chart).toBeDefined();
    expect(widget.data.chart.length).toBeGreaterThan(0);
    expect(widget.data.map).toBeDefined();
    expect(widget.data.map.length).toBeGreaterThan(0);
  });
});
