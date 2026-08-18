import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { EtlNotificationService } from '@api/infrastructure/etl-notification.service';
import { FSUtils } from '@api/infrastructure/fs/fs.utils';
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

describe('DataSourceManager - Multi-select survey answers', () => {
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

  it('should store multiple answers for the same survey and question indicator', async () => {
    const dataSource = testManager.getDataSource();
    const questionIndicatorMapRepo =
      dataSource.getRepository(QuestionIndicatorMap);
    const surveyAnswerRepo = dataSource.getRepository(SurveyAnswer);

    // Given: one indicator mapped to a multi-select question
    const multiSelectQuestion = 'Which technologies have you adopted?';
    await questionIndicatorMapRepo.save([
      { indicator: 'multi-select-tech', question: multiSelectQuestion },
    ]);

    // Given: a survey JSON file with multiple answers from the same survey for the same question
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dsm-multiselect-'));
    const tmpFile = path.join(tmpDir, 'test-multiselect.json');
    const surveyData = [
      {
        surveyId: 'survey-ms-1',
        question: multiSelectQuestion,
        answer: 'GPS/GNSS',
        countryCode: 'ESP',
      },
      {
        surveyId: 'survey-ms-1',
        question: multiSelectQuestion,
        answer: 'Drones',
        countryCode: 'ESP',
      },
      {
        surveyId: 'survey-ms-1',
        question: multiSelectQuestion,
        answer: 'Sensors',
        countryCode: 'ESP',
      },
    ];
    fs.writeFileSync(tmpFile, JSON.stringify(surveyData));

    // When
    await dataSourceManager.loadSurveyData(tmpFile, 1);

    // Then: all three answers should be stored
    const rows = await surveyAnswerRepo.find({
      where: {
        surveyId: 'survey-ms-1',
        questionIndicator: 'multi-select-tech',
      },
    });
    expect(rows).toHaveLength(3);
    const answers = rows.map((r) => r.answer).sort();
    expect(answers).toEqual(['Drones', 'GPS/GNSS', 'Sensors']);

    // Cleanup
    fs.unlinkSync(tmpFile);
    fs.rmdirSync(tmpDir);
  });

  it('should handle exact duplicate answers with upsert (idempotent)', async () => {
    const dataSource = testManager.getDataSource();
    const questionIndicatorMapRepo =
      dataSource.getRepository(QuestionIndicatorMap);
    const surveyAnswerRepo = dataSource.getRepository(SurveyAnswer);

    // Given: one indicator mapped to a question
    const question = 'Which farming practice do you use?';
    await questionIndicatorMapRepo.save([
      { indicator: 'idempotent-test', question: question },
    ]);

    // Given: a survey JSON file with duplicate exact answers (same surveyId, question, answer)
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dsm-idempotent-'));
    const tmpFile = path.join(tmpDir, 'test-idempotent.json');
    const surveyData = [
      {
        surveyId: 'survey-idem-1',
        question: question,
        answer: 'Organic',
        countryCode: 'FRA',
      },
      {
        surveyId: 'survey-idem-1',
        question: question,
        answer: 'Organic',
        countryCode: 'FRA',
      },
    ];
    fs.writeFileSync(tmpFile, JSON.stringify(surveyData));

    // When
    await dataSourceManager.loadSurveyData(tmpFile, 1);

    // Then: only one row should exist (upsert deduplicates exact matches)
    const rows = await surveyAnswerRepo.find({
      where: {
        surveyId: 'survey-idem-1',
        questionIndicator: 'idempotent-test',
      },
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].answer).toBe('Organic');

    // When: load the same data again (test idempotency)
    await dataSourceManager.loadSurveyData(tmpFile, 1);

    // Then: still only one row
    const rowsAfter = await surveyAnswerRepo.find({
      where: {
        surveyId: 'survey-idem-1',
        questionIndicator: 'idempotent-test',
      },
    });
    expect(rowsAfter).toHaveLength(1);

    // Cleanup
    fs.unlinkSync(tmpFile);
    fs.rmdirSync(tmpDir);
  });
});

describe('DataSourceManager - VTT automated data source tag', () => {
  let testManager: TestManager<unknown>;
  let dataSourceManager: DataSourceManager;
  let surveyAnswerRepo: Repository<SurveyAnswer>;
  let questionIndicatorMapRepo: Repository<QuestionIndicatorMap>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({
      logger: false,
      initialize: false,
    });
    dataSourceManager = testManager.testApp.get(DataSourceManager);
    const dataSource = testManager.getDataSource();
    surveyAnswerRepo = dataSource.getRepository(SurveyAnswer);
    questionIndicatorMapRepo = dataSource.getRepository(QuestionIndicatorMap);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  it('stores VTT rows with data_source=automated', async () => {
    const question = 'Has your organisation integrated digital technologies?';
    await questionIndicatorMapRepo.save([
      { indicator: 'vtt-indicator-1', question },
    ]);

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dsm-vtt-'));
    const tmpFile = path.join(tmpDir, 'surveys-vtt.json');
    fs.writeFileSync(
      tmpFile,
      JSON.stringify([
        { surveyId: 'vtt-s1', question, answer: 'Yes', countryCode: 'FIN' },
        { surveyId: 'vtt-s2', question, answer: 'No', countryCode: 'SWE' },
      ]),
    );

    await dataSourceManager.loadSurveyData(tmpFile, 1, 'automated');

    const rows = await surveyAnswerRepo.find({
      where: { questionIndicator: 'vtt-indicator-1' },
    });
    expect(rows).toHaveLength(2);
    expect(rows.every((r) => r.dataSource === 'automated')).toBe(true);
    expect(rows.every((r) => r.wave === 1)).toBe(true);

    fs.unlinkSync(tmpFile);
    fs.rmdirSync(tmpDir);
  });

  it('reload is idempotent and scoped to (wave, data_source)', async () => {
    const question = 'Has your organisation integrated digital technologies?';
    await questionIndicatorMapRepo.save([
      { indicator: 'vtt-idempotent', question },
    ]);

    // Seed a survey row to prove the delete scope is correct
    await surveyAnswerRepo.save({
      surveyId: 'survey-not-vtt',
      questionIndicator: 'vtt-idempotent',
      question,
      answer: 'Yes',
      countryCode: 'DEU',
      wave: 1,
      dataSource: 'survey',
    });

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dsm-vtt-idem-'));
    const tmpFile = path.join(tmpDir, 'surveys-vtt.json');
    fs.writeFileSync(
      tmpFile,
      JSON.stringify([
        {
          surveyId: 'vtt-idem-1',
          question,
          answer: 'Yes',
          countryCode: 'FIN',
        },
      ]),
    );

    await dataSourceManager.loadSurveyData(tmpFile, 1, 'automated');
    await dataSourceManager.loadSurveyData(tmpFile, 1, 'automated');

    const automatedRows = await surveyAnswerRepo.find({
      where: {
        questionIndicator: 'vtt-idempotent',
        dataSource: 'automated' as any,
      },
    });
    expect(automatedRows).toHaveLength(1);

    // The survey row with data_source='survey' must be untouched
    const surveyRows = await surveyAnswerRepo.find({
      where: { surveyId: 'survey-not-vtt' },
    });
    expect(surveyRows).toHaveLength(1);
    expect(surveyRows[0].dataSource).toBe('survey');

    fs.unlinkSync(tmpFile);
    fs.rmdirSync(tmpDir);
  });

  it('deduplicates exact (surveyId, indicator, answer) triples in the VTT file', async () => {
    const question = 'Has your organisation integrated digital technologies?';
    await questionIndicatorMapRepo.save([
      { indicator: 'vtt-dedup', question },
    ]);

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dsm-vtt-dedup-'));
    const tmpFile = path.join(tmpDir, 'surveys-vtt.json');
    fs.writeFileSync(
      tmpFile,
      JSON.stringify([
        {
          surveyId: 'vtt-dup-1',
          question,
          answer: 'Yes',
          countryCode: 'FIN',
        },
        {
          surveyId: 'vtt-dup-1',
          question,
          answer: 'Yes',
          countryCode: 'FIN',
        },
      ]),
    );

    await dataSourceManager.loadSurveyData(tmpFile, 1, 'automated');

    const rows = await surveyAnswerRepo.find({
      where: { surveyId: 'vtt-dup-1', questionIndicator: 'vtt-dedup' },
    });
    expect(rows).toHaveLength(1);

    fs.unlinkSync(tmpFile);
    fs.rmdirSync(tmpDir);
  });
});

describe('DataSourceManager - loadInitialData VTT wiring', () => {
  let dsm: DataSourceManager;
  let loadSurveyDataSpy: jest.SpyInstance;

  beforeEach(async () => {
    const fakeQueryRunner = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      query: jest.fn(),
      manager: { getRepository: jest.fn() },
    };
    const fakeConfigRepo = {
      findOne: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue(undefined),
    };
    const fakeDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(fakeQueryRunner),
      getRepository: jest.fn().mockReturnValue(fakeConfigRepo),
    };

    const module = await Test.createTestingModule({
      providers: [
        DataSourceManager,
        {
          provide: Logger,
          useValue: { log: jest.fn(), error: jest.fn(), warn: jest.fn() },
        },
        { provide: getDataSourceToken(), useValue: fakeDataSource },
        {
          provide: EtlNotificationService,
          useValue: {
            sendSuccessNotification: jest.fn(),
            sendFailureNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    dsm = module.get<DataSourceManager>(DataSourceManager);

    jest.spyOn(FSUtils, 'md5File').mockResolvedValue('deadbeef');
    jest.spyOn(FSUtils, 'md5Directory').mockResolvedValue('cafecafe');
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    jest.spyOn(dsm, 'loadQuestionIndicatorMap').mockResolvedValue(undefined);
    jest.spyOn(dsm, 'loadProjectionTypes').mockResolvedValue(undefined);
    jest.spyOn(dsm, 'loadPageFilters').mockResolvedValue(undefined);
    jest.spyOn(dsm, 'loadPageSections').mockResolvedValue(undefined);
    jest.spyOn(dsm, 'loadProjections').mockResolvedValue(undefined);
    jest.spyOn(dsm, 'generateProjectionsFilters').mockResolvedValue(undefined);
    jest.spyOn(dsm, 'generateProjectionsSettings').mockResolvedValue(undefined);
    jest.spyOn(dsm, 'generateProjectionsWidgets').mockResolvedValue(undefined);
    loadSurveyDataSpy = jest
      .spyOn(dsm, 'loadSurveyData')
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls loadSurveyData with the VTT path and automated tag', async () => {
    await dsm.loadInitialData();

    expect(loadSurveyDataSpy).toHaveBeenCalledWith(
      'data/surveys/surveys-vtt.json',
      1,
      'automated',
    );
  });

  it('skips VTT loadSurveyData when surveys-vtt.json does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    await dsm.loadInitialData();

    const vttCall = loadSurveyDataSpy.mock.calls.find(
      (args) => args[0] === 'data/surveys/surveys-vtt.json',
    );
    expect(vttCall).toBeUndefined();
  });
});
