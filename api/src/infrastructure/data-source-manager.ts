import * as fs from 'fs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SQLAdapter } from '@api/infrastructure/sql-adapter';
import { SectionsJSONParser } from 'api/data/sections/sections-json-parser';
import { SurveyAnswer } from '@shared/dto/surveys/survey-answer.entity';
import { QuestionIndicatorMap } from '@shared/dto/surveys/question-widget-map.entity';
import { Section } from '@shared/dto/sections/section.entity';

@Injectable()
export class DataSourceManager {
  public constructor(
    private readonly logger: Logger,
    @Inject(SQLAdapter) private readonly sqlAdapter: SQLAdapter,
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

  public async loadSurveyData(surveysfilePath?: string): Promise<void> {
    if (surveysfilePath === undefined) {
      surveysfilePath = `data/surveys/surveys.json`;
    }
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
