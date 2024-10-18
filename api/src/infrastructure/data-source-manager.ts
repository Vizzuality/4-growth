import * as fs from 'fs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SQLAdapter } from '@api/infrastructure/sql-adapter';
import { SectionsJSONParser } from 'api/data/sections/sections-json-parser';

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
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      await queryRunner.query(await this.getInitialSectionsSqlCode());
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private async getInitialSectionsSqlCode(): Promise<string> {
    const sectionsfilePath = `data/sections/sections.json`;
    this.logger.log(
      `Loading initial data from "${sectionsfilePath}"`,
      this.constructor.name,
    );
    const sections =
      await SectionsJSONParser.parseSectionsFromFile(sectionsfilePath);
    return this.sqlAdapter.generateSqlFromSections(sections);
  }

  private getQuestionIndicatorSqlCode(): string {
    const sectionsfilePath = `data/question-indicators.sql`;
    this.logger.log(
      `Loading initial data from "${sectionsfilePath}"`,
      this.constructor.name,
    );
    return fs.readFileSync(sectionsfilePath, 'utf-8');
  }

  // For testing purposes
  public async loadMockData(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      await queryRunner.query(this.getMockDataSqlCode());
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private getMockDataSqlCode(): string {
    const filePath = `data/mock-data.sql`;
    this.logger.log(
      `Loading initial data from "${filePath}"`,
      this.constructor.name,
    );
    return fs.readFileSync(filePath, 'utf-8');
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
