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
import {
  AVAILABLE_PROJECTION_FILTERS,
  PROJECTION_FILTER_NAME_TO_FIELD_NAME,
  ProjectionFilter,
} from '@shared/dto/projections/projection-filter.entity';
import { CountryISO3Map } from '@shared/constants/country-iso3.map';
import { ProjectionWidget } from '@shared/dto/projections/projection-widget.entity';
import { PROJECTION_VISUALIZATIONS } from '@shared/dto/projections/projection-visualizations.constants';
import { PROJECTION_TYPES } from '@shared/dto/projections/projection-types';

@Injectable()
export class DataSourceManager {
  public constructor(
    private readonly logger: Logger,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

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
      const sectionsRepository = this.dataSource.getRepository(Section);
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
  ): Promise<void> {
    this.logger.log(
      `Loading initial data from "${surveysfilePath}"`,
      this.constructor.name,
    );

    const answers = JSON.parse(
      await fs.promises.readFile(surveysfilePath, 'utf-8'),
    );

    const questionIndicatorMap =
      this.dataSource.getRepository(QuestionIndicatorMap);

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const answersRepository = this.dataSource.getRepository(SurveyAnswer);
      for (const answer of answers) {
        const foundQuestionIndicator = await questionIndicatorMap.findOneBy({
          question: answer.question,
        });
        if (foundQuestionIndicator === null) {
          this.logger.warn(
            `Cannot load survey data for '${answer.question}'. Question indicator not found.`,
            this.constructor.name,
          );
          continue;
        }
        answer.questionIndicator = foundQuestionIndicator.indicator;
        await answersRepository.save(answer);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  public async loadProjections(
    filePath: string = `data/projections/mock-projections.json`,
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
          visualizations: [PROJECTION_VISUALIZATIONS.LINE_CHART],
          defaultVisualization: PROJECTION_VISUALIZATIONS.LINE_CHART,
        },
        {
          id: 2,
          type: PROJECTION_TYPES.ADDRESSABLE_MARKET,
          title: 'Addressable Market',
          visualizations: [PROJECTION_VISUALIZATIONS.BAR_CHART],
          defaultVisualization: PROJECTION_VISUALIZATIONS.BAR_CHART,
        },
        {
          id: 3,
          type: PROJECTION_TYPES.PENETRATION,
          title: 'Penetration',
          visualizations: [PROJECTION_VISUALIZATIONS.AREA_CHART],
          defaultVisualization: PROJECTION_VISUALIZATIONS.AREA_CHART,
        },
        {
          id: 4,
          type: PROJECTION_TYPES.SHIPMENTS,
          title: 'Shipments',
          visualizations: [PROJECTION_VISUALIZATIONS.BAR_CHART],
          defaultVisualization: PROJECTION_VISUALIZATIONS.BAR_CHART,
        },
        {
          id: 5,
          type: PROJECTION_TYPES.INSTALLED_BASE,
          title: 'Installed Base',
          visualizations: [PROJECTION_VISUALIZATIONS.BAR_CHART],
          defaultVisualization: PROJECTION_VISUALIZATIONS.BAR_CHART,
        },
        {
          id: 6,
          type: PROJECTION_TYPES.PRICES,
          title: 'Prices',
          visualizations: [PROJECTION_VISUALIZATIONS.BAR_CHART],
          defaultVisualization: PROJECTION_VISUALIZATIONS.BAR_CHART,
        },
        {
          id: 7,
          type: PROJECTION_TYPES.REVENUES,
          title: 'Revenues',
          visualizations: [PROJECTION_VISUALIZATIONS.BAR_CHART],
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
          values:
            filterName !== 'country'
              ? distinctValues
              : distinctValues.map((v) =>
                  CountryISO3Map.getCountryNameByISO3(v),
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
