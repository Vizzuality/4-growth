import * as fs from 'fs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SectionsCSVParser } from 'api/data/sections/sections-csv-parser';
import { SQLAdapter } from '@api/infrastructure/sql-adapter';
import { PageFiltersCSVParser } from 'api/data/page-filters/page-filters-csv-parser';

@Injectable()
export class DataSourceManager {
  public constructor(
    private readonly logger: Logger,
    @Inject(SQLAdapter) private readonly sqlAdapter: SQLAdapter,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  public async loadInitialData(): Promise<void> {
    const schemaSql = this.getInitialSchemaSqlCode();
    const sqlScripts: string[] = await Promise.all([
      this.getInitialSectionsSqlCode(),
      this.getInitialPageFilters(),
      this.getMockDataSqlCode(),
    ]);

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      await queryRunner.query(schemaSql);
      const sqlCodePromises = [];
      for (let sqlCodeIdx = 0; sqlCodeIdx < sqlScripts.length; sqlCodeIdx++) {
        sqlCodePromises.push(queryRunner.query(sqlScripts[sqlCodeIdx]));
      }
      await Promise.all(sqlCodePromises);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private getInitialSchemaSqlCode(): string {
    const schemafilePath = `data/schema.sql`;
    this.logger.log(
      `Loading initial schema from "${schemafilePath}"`,
      this.constructor.name,
    );

    return fs.readFileSync(schemafilePath, 'utf-8');
  }

  private async getInitialSectionsSqlCode(): Promise<string> {
    const sectionsfilePath = `data/sections/chart-types.csv`;
    this.logger.log(
      `Loading initial data from "${sectionsfilePath}"`,
      this.constructor.name,
    );
    const sections = await SectionsCSVParser.parseSectionsFromFile(
      sectionsfilePath,
      {
        delimiter: ';',
      },
    );
    return this.sqlAdapter.generateSqlFromSections(sections);
  }

  private async getInitialPageFilters(): Promise<string> {
    const pageFiltersFilePath = `data/page-filters/page-filters.csv`;
    this.logger.log(
      `Loading initial data from "${pageFiltersFilePath}"`,
      this.constructor.name,
    );
    const pageFilters =
      await PageFiltersCSVParser.parseFromFile(pageFiltersFilePath);
    return this.sqlAdapter.generateSqlFromPageFilters(pageFilters);
  }

  public async loadMockData(): Promise<void> {
    const schemaSql = this.getInitialSchemaSqlCode();
    const sqlScripts: string[] = await Promise.all([this.getMockDataSqlCode()]);

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      await queryRunner.query(schemaSql);
      const sqlCodePromises = [];
      for (let sqlCodeIdx = 0; sqlCodeIdx < sqlScripts.length; sqlCodeIdx++) {
        sqlCodePromises.push(queryRunner.query(sqlScripts[sqlCodeIdx]));
      }
      await Promise.all(sqlCodePromises);
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
}
