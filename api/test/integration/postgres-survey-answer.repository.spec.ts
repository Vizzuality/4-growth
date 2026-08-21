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
import { SEARCH_WIDGET_DATA_OPERATORS } from '@shared/dto/global/search-widget-data-params';

const makeChartWidget = (indicator: string): BaseWidgetWithData =>
  ({
    indicator,
    visualisations: [WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART],
    defaultVisualization: WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART,
    data: {},
    responseRate: 0,
    absoluteValue: 0,
  }) as BaseWidgetWithData;

const makeMapWidget = (indicator: string): BaseWidgetWithData =>
  ({
    indicator,
    visualisations: [WIDGET_VISUALIZATIONS.MAP],
    defaultVisualization: WIDGET_VISUALIZATIONS.MAP,
    data: {},
    responseRate: 0,
    absoluteValue: 0,
  }) as BaseWidgetWithData;

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

  it('excludes N/A but counts "Not at all" and "Don\'t know" in the map denominator', async () => {
    await testManager
      .mocks()
      .ensureQuestionIndicatorMapExists(testManager.getDataSource(), {
        indicator: TEST_INDICATOR,
        question: 'Test question for map',
      });

    const answersRepo = testManager.getDataSource().getRepository(SurveyAnswer);
    const answer = (surveyId: string, answer: string) => ({
      surveyId,
      questionIndicator: TEST_INDICATOR,
      question: 'Test question for map',
      answer,
      countryCode: 'AUT',
    });

    await answersRepo.save([
      answer('aut-1', 'Yes'),
      answer('aut-2', 'Yes'),
      answer('aut-3', 'Not at all'),
      answer('aut-4', "Don't know"),
      answer('aut-5', 'N/A'),
      answer('aut-6', 'N/A'),
      answer('aut-7', 'N/A'),
    ]);

    const widget: BaseWidgetWithData = {
      indicator: TEST_INDICATOR,
      visualisations: [WIDGET_VISUALIZATIONS.MAP],
      defaultVisualization: WIDGET_VISUALIZATIONS.MAP,
      data: {},
      responseRate: 0,
      absoluteValue: 0,
    } as BaseWidgetWithData;

    await surveyAnswerRepo.addSurveyDataToBaseWidget(widget, {});

    const autEntry = widget.data.map.find((entry) => entry.country === 'AUT');
    // 2 Yes of the 4 answers given. The 3 N/A rows are non-response and stay
    // out of the divisor; before the fix the divisor held only the Yes rows and
    // every country came back as 100%.
    expect(Number(autEntry.value)).toBeCloseTo(50, 0);
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

describe('PostgresSurveyAnswerRepository - data-source filter', () => {
  let testManager: TestManager<unknown>;
  let surveyAnswerRepo: ISurveyAnswerRepository;

  const INDICATOR = 'ds-filter-test-indicator';
  const QUESTION = 'Test question for data-source filter';
  const BREAKDOWN_INDICATOR = 'ds-filter-breakdown-indicator';

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
    surveyAnswerRepo = testManager.getModule<ISurveyAnswerRepository>(
      SurveyAnswerRepository,
    );

    const dataSource = testManager.getDataSource();
    await testManager
      .mocks()
      .ensureQuestionIndicatorMapExists(dataSource, {
        indicator: INDICATOR,
        question: QUESTION,
      });
    await testManager
      .mocks()
      .ensureQuestionIndicatorMapExists(dataSource, {
        indicator: BREAKDOWN_INDICATOR,
        question: 'Breakdown axis question',
      });

    const answersRepo = dataSource.getRepository(SurveyAnswer);
    await answersRepo.save([
      // Survey rows in Spain
      {
        surveyId: 'sv-ds-1',
        questionIndicator: INDICATOR,
        question: QUESTION,
        answer: 'Yes',
        countryCode: 'ESP',
        dataSource: 'survey',
      },
      {
        surveyId: 'sv-ds-2',
        questionIndicator: INDICATOR,
        question: QUESTION,
        answer: 'Yes',
        countryCode: 'ESP',
        dataSource: 'survey',
      },
      {
        surveyId: 'sv-ds-3',
        questionIndicator: INDICATOR,
        question: QUESTION,
        answer: 'No',
        countryCode: 'ESP',
        dataSource: 'survey',
      },
      // Automated rows in France
      {
        surveyId: 'auto_ds-1',
        questionIndicator: INDICATOR,
        question: QUESTION,
        answer: 'No',
        countryCode: 'FRA',
        dataSource: 'automated',
      },
      {
        surveyId: 'auto_ds-2',
        questionIndicator: INDICATOR,
        question: QUESTION,
        answer: 'Yes',
        countryCode: 'FRA',
        dataSource: 'automated',
      },
      // Breakdown axis rows (same survey IDs so the JOIN works)
      {
        surveyId: 'sv-ds-1',
        questionIndicator: BREAKDOWN_INDICATOR,
        question: 'Breakdown axis question',
        answer: 'GroupA',
        countryCode: 'ESP',
        dataSource: 'survey',
      },
      {
        surveyId: 'auto_ds-1',
        questionIndicator: BREAKDOWN_INDICATOR,
        question: 'Breakdown axis question',
        answer: 'GroupB',
        countryCode: 'FRA',
        dataSource: 'automated',
      },
    ]);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  it('should return only survey rows when filtering by data-source = survey', async () => {
    const widget = makeChartWidget(INDICATOR);

    await surveyAnswerRepo.addSurveyDataToBaseWidget(widget, {
      filters: [
        {
          name: 'data-source',
          operator: SEARCH_WIDGET_DATA_OPERATORS.EQUALS,
          values: ['survey'],
        },
      ],
    });

    expect(widget.data.chart).toBeDefined();
    const total = widget.data.chart.reduce(
      (sum: number, item: any) => sum + item.value,
      0,
    );
    expect(total).toBe(3); // 3 survey rows, 0 automated
    expect(widget.data.chart).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Yes', value: 2 }),
        expect.objectContaining({ label: 'No', value: 1 }),
      ]),
    );
  });

  it('should return only automated rows when filtering by data-source = automated', async () => {
    const widget = makeChartWidget(INDICATOR);

    await surveyAnswerRepo.addSurveyDataToBaseWidget(widget, {
      filters: [
        {
          name: 'data-source',
          operator: SEARCH_WIDGET_DATA_OPERATORS.EQUALS,
          values: ['automated'],
        },
      ],
    });

    expect(widget.data.chart).toBeDefined();
    const total = widget.data.chart.reduce(
      (sum: number, item: any) => sum + item.value,
      0,
    );
    expect(total).toBe(2); // 2 automated rows, 0 survey
    expect(widget.data.chart).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Yes', value: 1 }),
        expect.objectContaining({ label: 'No', value: 1 }),
      ]),
    );
  });

  it('should return all rows from both sources when no data-source filter is applied', async () => {
    const widget = makeChartWidget(INDICATOR);

    await surveyAnswerRepo.addSurveyDataToBaseWidget(widget, { filters: [] });

    expect(widget.data.chart).toBeDefined();
    const total = widget.data.chart.reduce(
      (sum: number, item: any) => sum + item.value,
      0,
    );
    expect(total).toBe(5); // 3 survey + 2 automated
  });

  it('should combine data-source filter with location-country-region filter', async () => {
    const widget = makeChartWidget(INDICATOR);

    await surveyAnswerRepo.addSurveyDataToBaseWidget(widget, {
      filters: [
        {
          name: 'data-source',
          operator: SEARCH_WIDGET_DATA_OPERATORS.EQUALS,
          values: ['survey'],
        },
        {
          name: 'location-country-region',
          operator: SEARCH_WIDGET_DATA_OPERATORS.EQUALS,
          values: ['Spain'],
        },
      ],
    });

    // Only ESP survey rows survive both filters
    const total = widget.data.chart.reduce(
      (sum: number, item: any) => sum + item.value,
      0,
    );
    expect(total).toBe(3);
    // No FRA automated rows should appear
    expect(
      widget.data.chart.every((item: any) => item.value <= 3),
    ).toBe(true);
  });

  it('should filter map data by data-source and only show countries with matching rows', async () => {
    const widget = makeMapWidget(INDICATOR);

    await surveyAnswerRepo.addSurveyDataToBaseWidget(widget, {
      filters: [
        {
          name: 'data-source',
          operator: SEARCH_WIDGET_DATA_OPERATORS.EQUALS,
          values: ['automated'],
        },
      ],
    });

    expect(widget.data.map).toBeDefined();
    const fraEntry = widget.data.map.find((e: any) => e.country === 'FRA');
    const espEntry = widget.data.map.find((e: any) => e.country === 'ESP');

    // FRA has automated data → should have a computed value
    expect(fraEntry).toBeDefined();
    expect(fraEntry.value).not.toBeNull();

    // ESP only has survey data → should have no value when filtering to automated
    expect(espEntry?.value ?? null).toBeNull();
  });

  it('should filter breakdown data by data-source', async () => {
    const widget = makeChartWidget(INDICATOR);

    await surveyAnswerRepo.addSurveyDataToBaseWidget(widget, {
      filters: [
        {
          name: 'data-source',
          operator: SEARCH_WIDGET_DATA_OPERATORS.EQUALS,
          values: ['survey'],
        },
      ],
      breakdownIndicator: BREAKDOWN_INDICATOR,
    });

    expect(widget.data.breakdown).toBeDefined();
    // Only the survey pair (sv-ds-1) is present: GroupA with Yes
    expect(widget.data.breakdown).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'GroupA',
          data: expect.arrayContaining([
            expect.objectContaining({ label: 'Yes' }),
          ]),
        }),
      ]),
    );
    // GroupB belongs only to automated rows — must not appear
    const groupBEntry = widget.data.breakdown.find(
      (item: any) => item.label === 'GroupB',
    );
    expect(groupBEntry).toBeUndefined();
  });
});

describe('PostgresSurveyAnswerRepository - multi-scope filter (EAV bug regression)', () => {
  let testManager: TestManager<unknown>;
  let surveyAnswerRepo: ISurveyAnswerRepository;

  const CHART_INDICATOR = 'ms-chart-indicator';
  const SCOPE_INDICATOR = 'ms-scope-indicator';
  const BREAKDOWN_INDICATOR = 'ms-breakdown-indicator';
  const QUESTION = 'Multi-scope test question';

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
    surveyAnswerRepo = testManager.getModule<ISurveyAnswerRepository>(
      SurveyAnswerRepository,
    );

    const dataSource = testManager.getDataSource();
    await testManager
      .mocks()
      .ensureQuestionIndicatorMapExists(dataSource, {
        indicator: CHART_INDICATOR,
        question: QUESTION,
      });
    await testManager
      .mocks()
      .ensureQuestionIndicatorMapExists(dataSource, {
        indicator: SCOPE_INDICATOR,
        question: 'Multi-scope scope filter question',
      });
    await testManager
      .mocks()
      .ensureQuestionIndicatorMapExists(dataSource, {
        indicator: BREAKDOWN_INDICATOR,
        question: 'Multi-scope breakdown question',
      });

    const answersRepo = dataSource.getRepository(SurveyAnswer);
    await answersRepo.save([
      // ms-1: automated, scope=Match, chart=Yes, breakdown=GroupA
      {
        surveyId: 'ms-1',
        questionIndicator: CHART_INDICATOR,
        question: QUESTION,
        answer: 'Yes',
        countryCode: 'ESP',
        dataSource: 'automated',
      },
      {
        surveyId: 'ms-1',
        questionIndicator: SCOPE_INDICATOR,
        question: 'Multi-scope scope filter question',
        answer: 'Match',
        countryCode: 'ESP',
        dataSource: 'automated',
      },
      {
        surveyId: 'ms-1',
        questionIndicator: BREAKDOWN_INDICATOR,
        question: 'Multi-scope breakdown question',
        answer: 'GroupA',
        countryCode: 'ESP',
        dataSource: 'automated',
      },
      // ms-2: automated, scope=Match, chart=No (no breakdown row)
      {
        surveyId: 'ms-2',
        questionIndicator: CHART_INDICATOR,
        question: QUESTION,
        answer: 'No',
        countryCode: 'ESP',
        dataSource: 'automated',
      },
      {
        surveyId: 'ms-2',
        questionIndicator: SCOPE_INDICATOR,
        question: 'Multi-scope scope filter question',
        answer: 'Match',
        countryCode: 'ESP',
        dataSource: 'automated',
      },
      // ms-3: automated, scope=Other — must be excluded by scope filter
      {
        surveyId: 'ms-3',
        questionIndicator: CHART_INDICATOR,
        question: QUESTION,
        answer: 'Yes',
        countryCode: 'ESP',
        dataSource: 'automated',
      },
      {
        surveyId: 'ms-3',
        questionIndicator: SCOPE_INDICATOR,
        question: 'Multi-scope scope filter question',
        answer: 'Other',
        countryCode: 'ESP',
        dataSource: 'automated',
      },
    ]);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  it('returns chart data when data-source + per-question scope filter are combined (Symptom A)', async () => {
    const widget = makeChartWidget(CHART_INDICATOR);

    await surveyAnswerRepo.addSurveyDataToBaseWidget(widget, {
      filters: [
        {
          name: 'data-source',
          operator: SEARCH_WIDGET_DATA_OPERATORS.EQUALS,
          values: ['automated'],
        },
        {
          name: SCOPE_INDICATOR,
          operator: SEARCH_WIDGET_DATA_OPERATORS.EQUALS,
          values: ['Match'],
        },
      ],
    });

    expect(widget.data.chart).toBeDefined();
    // ms-1 (Yes) and ms-2 (No) match; ms-3 (Other scope) must be excluded
    const total = widget.data.chart.reduce(
      (sum: number, item: any) => sum + item.value,
      0,
    );
    expect(total).toBe(2);
    expect(widget.data.chart).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Yes', value: 1 }),
        expect.objectContaining({ label: 'No', value: 1 }),
      ]),
    );
  });

  it('returns breakdown data when data-source + per-question scope filter are combined (Symptom B)', async () => {
    const widget = makeChartWidget(CHART_INDICATOR);

    await surveyAnswerRepo.addSurveyDataToBaseWidget(widget, {
      filters: [
        {
          name: 'data-source',
          operator: SEARCH_WIDGET_DATA_OPERATORS.EQUALS,
          values: ['automated'],
        },
        {
          name: SCOPE_INDICATOR,
          operator: SEARCH_WIDGET_DATA_OPERATORS.EQUALS,
          values: ['Match'],
        },
      ],
      breakdownIndicator: BREAKDOWN_INDICATOR,
    });

    expect(widget.data.breakdown).toBeDefined();
    expect(widget.data.breakdown.length).toBeGreaterThan(0);
    // ms-1 is the only survey with a BREAKDOWN_INDICATOR row inside the Match scope
    const groupA = widget.data.breakdown.find(
      (item: any) => item.label === 'GroupA',
    );
    expect(groupA).toBeDefined();
    expect(groupA.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ label: 'Yes' })]),
    );
  });
});
