import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Repository } from 'typeorm';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { TestManager } from 'api/test/utils/test-manager';
import { Section } from '@shared/dto/sections/section.entity';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { PageFilter } from '@shared/dto/widgets/page-filter.entity';
import { QuestionIndicatorMap } from '@shared/dto/surveys/question-widget-map.entity';
import { SurveyAnswer } from '@shared/dto/surveys/survey-answer.entity';

describe('DataSourceManager', () => {
  let testManager: TestManager<unknown>;
  let dataSourceManager: DataSourceManager;

  let sectionsRepository: Repository<Section>;
  let baseWidgetsRepository: Repository<BaseWidget>;
  let pageFilterRepository: Repository<PageFilter>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({
      logger: false,
      initialize: false,
    });
    dataSourceManager = testManager.testApp.get(DataSourceManager);

    const dataSource = testManager.getDataSource();
    sectionsRepository = dataSource.getRepository(Section);
    baseWidgetsRepository = dataSource.getRepository(BaseWidget);
    pageFilterRepository = dataSource.getRepository(PageFilter);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  let initialSectionCount: number;
  let initialBaseWidgetCount: number;
  let initialPageFilterCount: number;

  it('should properly load the initial schema and data', async () => {
    // When
    await dataSourceManager.loadQuestionIndicatorMap();
    await Promise.all([
      dataSourceManager.loadPageFilters(),
      dataSourceManager.loadPageSections(),
      dataSourceManager.loadSurveyData(),
    ]);

    // Then
    initialSectionCount = await sectionsRepository.count();
    expect(initialSectionCount).toBeGreaterThan(0);

    initialBaseWidgetCount = await baseWidgetsRepository.count();
    expect(initialBaseWidgetCount).toBeGreaterThan(0);

    initialPageFilterCount = await pageFilterRepository.count();
    expect(initialPageFilterCount).toBeGreaterThan(0);
  });

  it('should not insert new records on subsequent calls (idempotency test)', async () => {
    // When
    await dataSourceManager.loadQuestionIndicatorMap();
    await Promise.all([
      dataSourceManager.loadPageFilters(),
      dataSourceManager.loadPageSections(),
      dataSourceManager.loadSurveyData(),
    ]);

    // Then
    const newSectionCount = await sectionsRepository.count();
    expect(newSectionCount).toBe(initialSectionCount);

    const newBaseWidgetCount = await baseWidgetsRepository.count();
    expect(newBaseWidgetCount).toBe(initialBaseWidgetCount);

    initialPageFilterCount = await pageFilterRepository.count();
    expect(initialPageFilterCount).toBeGreaterThan(0);
  });
});

describe('DataSourceManager - Multi-indicator question mapping', () => {
  let testManager: TestManager<unknown>;
  let dataSourceManager: DataSourceManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({
      logger: false,
      initialize: false,
    });
    dataSourceManager = testManager.testApp.get(DataSourceManager);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  it('should create survey_answers rows for every indicator mapped to the same question', async () => {
    const dataSource = testManager.getDataSource();
    const questionIndicatorMapRepo =
      dataSource.getRepository(QuestionIndicatorMap);
    const surveyAnswerRepo = dataSource.getRepository(SurveyAnswer);

    // Given: two indicators mapped to the same question
    const sharedQuestion =
      'Has your organisation integrated digital technologies?';
    await questionIndicatorMapRepo.save([
      { indicator: 'indicator-a', question: sharedQuestion },
      { indicator: 'indicator-b', question: sharedQuestion },
    ]);

    // Given: a survey JSON file with one answer for that question
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dsm-test-'));
    const tmpFile = path.join(tmpDir, 'test-surveys.json');
    const surveyData = [
      {
        surveyId: 'multi-ind-1',
        question: sharedQuestion,
        answer: 'Yes',
        countryCode: 'ESP',
      },
    ];
    fs.writeFileSync(tmpFile, JSON.stringify(surveyData));

    // When
    await dataSourceManager.loadSurveyData(tmpFile, 1);

    // Then: both indicators should have a row
    const rows = await surveyAnswerRepo.find({
      where: { surveyId: 'multi-ind-1' },
    });
    expect(rows).toHaveLength(2);
    const indicators = rows.map((r) => r.questionIndicator).sort();
    expect(indicators).toEqual(['indicator-a', 'indicator-b']);

    // Cleanup
    fs.unlinkSync(tmpFile);
    fs.rmdirSync(tmpDir);
  });
});
