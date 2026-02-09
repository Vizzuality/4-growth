import { createHash } from 'crypto';
import * as fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SectionsJSONParser } from 'api/data/sections/sections-json-parser';
import { SurveyAnswer } from '@shared/dto/surveys/survey-answer.entity';
import { QuestionIndicatorMap } from '@shared/dto/surveys/question-widget-map.entity';
import { Section } from '@shared/dto/sections/section.entity';
import { Projection } from '@shared/dto/projections/projection.entity';
import { ProjectionData } from '@shared/dto/projections/projection-data.entity';
import { ProjectionType } from '@shared/dto/projections/projection-type.entity';
import {
  AVAILABLE_PROJECTION_FILTERS,
  PROJECTION_FILTER_NAME_TO_FIELD_NAME,
  ProjectionFilter,
} from '@shared/dto/projections/projection-filter.entity';
import { CountryISOMap } from '@shared/constants/country-iso.map';
import { ProjectionWidget } from '@shared/dto/projections/projection-widget.entity';
import {
  AVAILABLE_PROJECTION_2D_VISUALIZATIONS,
  PROJECTION_VISUALIZATIONS,
} from '@shared/dto/projections/projection-visualizations.constants';
import { PROJECTION_TYPES } from '@shared/dto/projections/projection-types';
import { Cron } from '@nestjs/schedule';
import { EtlNotificationService } from './etl-notification.service';
import { ConfigurationParams } from '@shared/dto/global/configuration-params';
import { FSUtils } from '@api/infrastructure/fs/fs.utils';
import * as config from 'config';

@Injectable()
export class DataSourceManager {
  public constructor(
    private readonly logger: Logger,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly etlNotificationService: EtlNotificationService,
  ) {}

  @Cron('0 3 * * 0', {
    name: 'ETL Process',
    disabled: !config.get<boolean>('etl.cronEnabled'),
  })
  public async performETL(): Promise<void> {
    this.logger.log('Starting ETL process', this.constructor.name);
    try {
      // Wave 1 extraction and transformation
      const { extract } = await import(
        `${__dirname}/../../data/surveys/extract`
      );
      const { transform } = await import(
        `${__dirname}/../../data/surveys/transform`
      );
      await extract();
      await transform();

      // Wave 2 extraction and transformation (OData)
      const { extractWave2 } = await import(
        `${__dirname}/../../data/surveys/extract-wave2`
      );
      const { transformWave2 } = await import(
        `${__dirname}/../../data/surveys/transform-wave2`
      );
      await extractWave2();
      await transformWave2();

      // Wave 3 extraction and transformation (OData)
      const { extractWave3 } = await import(
        `${__dirname}/../../data/surveys/extract-wave3`
      );
      const { transformWave3 } = await import(
        `${__dirname}/../../data/surveys/transform-wave3`
      );
      await extractWave3();
      await transformWave3();

      await this.loadInitialData();
      this.logger.log(
        'ETL process completed successfully',
        this.constructor.name,
      );
      await this.etlNotificationService.sendSuccessNotification();
    } catch (error) {
      this.logger.error('ETL process failed', error, this.constructor.name);
      await this.etlNotificationService.sendFailureNotification(error);
      throw error;
    }
  }

  // Method to manually trigger ETL process (for testing or admin purposes)
  public async triggerETLManually(): Promise<void> {
    return this.performETL();
  }

  public async loadInitialData() {
    const results = await Promise.all([
      FSUtils.md5File(`data/filters.sql`),
      FSUtils.md5File(`data/question-indicators.sql`),
      FSUtils.md5File(`data/surveys/surveys.json`),
      FSUtils.md5File(`data/surveys/surveys-wave2.json`),
      FSUtils.md5File(`data/surveys/surveys-wave3.json`),
      FSUtils.md5File(`data/sections/sections.json`),
      FSUtils.md5File(`data/projections/projections.json`),
      FSUtils.md5File(`data/projections/projection-types.json`),
      FSUtils.md5Directory(`${__dirname}/../migrations`),
    ]);
    const latestDataVersion = createHash('md5')
      .update(results.join(''))
      .digest('hex');

    const configParamsRepo = this.dataSource.getRepository(ConfigurationParams);
    const currentDataVersion = await configParamsRepo.findOne({
      where: { param: 'data_version' },
    });
    if (currentDataVersion?.value === latestDataVersion) {
      return;
    }

    await this.loadQuestionIndicatorMap();
    await this.loadProjectionTypes();
    await Promise.all([
      this.loadPageFilters(),
      this.loadPageSections(),
      this.loadSurveyData('data/surveys/surveys.json', 1),
      this.loadSurveyData('data/surveys/surveys-wave2.json', 2),
      this.loadSurveyData('data/surveys/surveys-wave3.json', 3),

      // Projections
      this.loadProjections(),
    ]);
    await Promise.all([
      this.generateProjectionsFilters(),
      this.generateProjectionsSettings(),
      this.generateProjectionsWidgets(),
    ]);

    await configParamsRepo.save({
      param: 'data_version',
      value: latestDataVersion,
    });
  }

  public async loadQuestionIndicatorMap(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      await queryRunner.query(this.getQuestionIndicatorSqlCode());
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  public async loadPageFilters(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      await queryRunner.query(this.getFiltersSqlCode());
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  public async loadPageSections(): Promise<void> {
    const sectionsfilePath = `data/sections/sections.json`;
    this.logger.log(
      `Loading initial data from "${sectionsfilePath}"`,
      this.constructor.name,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const sectionsRepository = queryRunner.manager.getRepository(Section);
      await queryRunner.query(
        `TRUNCATE ${sectionsRepository.metadata.tableName} CASCADE`,
      );
      const sections =
        await SectionsJSONParser.parseSectionsFromFile(sectionsfilePath);
      await sectionsRepository.save(sections);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  public async loadSurveyData(
    surveysfilePath: string = `data/surveys/surveys.json`,
    wave: number = 1,
  ): Promise<void> {
    this.logger.log(
      `Loading Wave ${wave} data from "${surveysfilePath}"`,
      this.constructor.name,
    );

    const answers = JSON.parse(
      await fs.promises.readFile(surveysfilePath, 'utf-8'),
    );

    const questionIndicatorMapRepo =
      this.dataSource.getRepository(QuestionIndicatorMap);
    const allMappings = await questionIndicatorMapRepo.find();
    const indicatorsByQuestion = new Map<string, string[]>();
    for (const m of allMappings) {
      const existing = indicatorsByQuestion.get(m.question);
      if (existing) {
        existing.push(m.indicator);
      } else {
        indicatorsByQuestion.set(m.question, [m.indicator]);
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const answersRepository = this.dataSource.getRepository(SurveyAnswer);
      // Use Map to deduplicate exact duplicates (same surveyId + indicator + answer)
      // but preserve different answers for the same surveyId + indicator (multi-select)
      const deduped = new Map<string, SurveyAnswer>();
      for (const answer of answers) {
        const indicators = indicatorsByQuestion.get(answer.question);
        if (indicators === undefined) {
          this.logger.warn(
            `Cannot load survey data for '${answer.question}'. Question indicator not found.`,
            this.constructor.name,
          );
          continue;
        }
        for (const indicator of indicators) {
          // Key includes answer to preserve multi-select, dedupe exact duplicates
          const key = `${answer.surveyId}:${indicator}:${answer.answer}`;
          deduped.set(key, {
            ...answer,
            questionIndicator: indicator,
            wave,
          });
        }
      }
      const batch = Array.from(deduped.values());
      const CHUNK_SIZE = 500;
      for (let i = 0; i < batch.length; i += CHUNK_SIZE) {
        await answersRepository.upsert(batch.slice(i, i + CHUNK_SIZE), [
          'surveyId',
          'questionIndicator',
          'answer',
        ]);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  public async loadProjectionTypes(
    filePath: string = `data/projections/projection-types.json`,
  ): Promise<void> {
    this.logger.log(
      `Loading projection types from "${filePath}"`,
      this.constructor.name,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const projectionTypeRepo =
        queryRunner.manager.getRepository(ProjectionType);
      await queryRunner.query(
        `TRUNCATE ${projectionTypeRepo.metadata.tableName} CASCADE`,
      );

      const projectionTypes = JSON.parse(
        await fs.promises.readFile(filePath, 'utf-8'),
      ) as ProjectionType[];

      await projectionTypeRepo.insert(projectionTypes);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  public async loadProjections(
    filePath: string = `data/projections/projections.json`,
  ): Promise<void> {
    this.logger.log(
      `Loading initial projections from "${filePath}"`,
      this.constructor.name,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const projectionRepo = queryRunner.manager.getRepository(Projection);
      const projectionDataRepo =
        queryRunner.manager.getRepository(ProjectionData);
      await queryRunner.query(
        `TRUNCATE ${projectionRepo.metadata.tableName} CASCADE`,
      );

      const projections = JSON.parse(
        await fs.promises.readFile(filePath, 'utf-8'),
      ) as Projection[];

      const promises = [];
      for (const projection of projections) {
        promises.push(projectionRepo.insert(projection));
        promises.push(projectionDataRepo.insert(projection.projectionData));
      }
      await Promise.all(promises);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  public async generateProjectionsWidgets(): Promise<void> {
    this.logger.log(`Generating projections widgets`, this.constructor.name);

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const projectionWidgetRepository =
        this.dataSource.getRepository(ProjectionWidget);

      await queryRunner.query(
        `TRUNCATE ${projectionWidgetRepository.metadata.tableName}`,
      );
      projectionWidgetRepository.save([
        {
          id: 1,
          type: PROJECTION_TYPES.MARKET_POTENTIAL,
          title: 'Market Potential',
          visualizations: AVAILABLE_PROJECTION_2D_VISUALIZATIONS,
          defaultVisualization: PROJECTION_VISUALIZATIONS.LINE_CHART,
        },
        {
          id: 2,
          type: PROJECTION_TYPES.ADDRESSABLE_MARKET,
          title: 'Addressable Market',
          visualizations: AVAILABLE_PROJECTION_2D_VISUALIZATIONS,
          defaultVisualization: PROJECTION_VISUALIZATIONS.BAR_CHART,
        },
        {
          id: 3,
          type: PROJECTION_TYPES.PENETRATION,
          title: 'Penetration',
          visualizations: AVAILABLE_PROJECTION_2D_VISUALIZATIONS,
          defaultVisualization: PROJECTION_VISUALIZATIONS.LINE_CHART,
        },
        {
          id: 4,
          type: PROJECTION_TYPES.SHIPMENTS,
          title: 'Shipments',
          visualizations: AVAILABLE_PROJECTION_2D_VISUALIZATIONS,
          defaultVisualization: PROJECTION_VISUALIZATIONS.TABLE,
        },
        {
          id: 5,
          type: PROJECTION_TYPES.INSTALLED_BASE,
          title: 'Installed Base',
          visualizations: AVAILABLE_PROJECTION_2D_VISUALIZATIONS,
          defaultVisualization: PROJECTION_VISUALIZATIONS.BAR_CHART,
        },
        {
          id: 6,
          type: PROJECTION_TYPES.PRICES,
          title: 'Prices',
          visualizations: AVAILABLE_PROJECTION_2D_VISUALIZATIONS,
          defaultVisualization: PROJECTION_VISUALIZATIONS.BAR_CHART,
        },
        {
          id: 7,
          type: PROJECTION_TYPES.REVENUES,
          title: 'Revenues',
          visualizations: AVAILABLE_PROJECTION_2D_VISUALIZATIONS,
          defaultVisualization: PROJECTION_VISUALIZATIONS.BAR_CHART,
        },
      ]);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  public async generateProjectionsFilters(): Promise<void> {
    this.logger.log(`Generating projections filters`, this.constructor.name);

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();

      const projectionRepo = queryRunner.manager.getRepository(Projection);
      const filterRepo = queryRunner.manager.getRepository(ProjectionFilter);

      await queryRunner.query(
        `TRUNCATE ${filterRepo.metadata.tableName} CASCADE`,
      );

      for (const filterName of AVAILABLE_PROJECTION_FILTERS) {
        const fieldName = PROJECTION_FILTER_NAME_TO_FIELD_NAME[filterName];
        const values = await projectionRepo
          .createQueryBuilder('projection')
          .select(`DISTINCT projection.${fieldName}`, fieldName)
          .orderBy(`projection.${fieldName}`, 'ASC')
          .getRawMany();

        const distinctValues: string[] = values
          .map((v) => v[fieldName])
          .filter((val): val is string => typeof val === 'string');

        const filter = filterRepo.create({
          name: filterName,
          label: filterName
            .split('_')
            .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
            .join(' '),
          values:
            filterName !== 'country'
              ? distinctValues
              : distinctValues.map((v) =>
                  CountryISOMap.getCountryNameByISO3(v),
                ),
        });

        await filterRepo.save(filter);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  public async generateProjectionsSettings(): Promise<void> {
    this.logger.log(`Generating projections settings`, this.constructor.name);
  }

  private getQuestionIndicatorSqlCode(): string {
    const sectionsfilePath = `data/question-indicators.sql`;
    this.logger.log(
      `Loading initial data from "${sectionsfilePath}"`,
      this.constructor.name,
    );
    return fs.readFileSync(sectionsfilePath, 'utf-8');
  }

  private getFiltersSqlCode(): string {
    const filePath = `data/filters.sql`;
    this.logger.log(
      `Loading initial data from "${filePath}"`,
      this.constructor.name,
    );
    return fs.readFileSync(filePath, 'utf-8');
  }
}
