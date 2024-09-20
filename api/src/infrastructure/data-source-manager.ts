import * as fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SectionsCSVParser } from 'api/data/sections-csv-parser';
import { SQLAdapter } from 'api/data/sql-adapter';

@Injectable()
export class DataSourceManager {
  private readonly logger: Logger;

  public constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  public async loadInitialData(): Promise<void> {
    const schemafilePath = `data/schema.sql`;
    const sectionsfilePath = `data/survey.csv`;
    this.logger.log(`Loading initial schema from "${schemafilePath}"`);
    this.logger.log(`Loading initial data from "${sectionsfilePath}"`);
    const sections = await SectionsCSVParser.parseSectionsFromFile(
      sectionsfilePath,
      {
        delimiter: ';',
      },
    );
    const schemaSql = fs.readFileSync(schemafilePath, 'utf-8');
    const sectionsSqlCode = SQLAdapter.generateSqlFromSections(sections);
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      await queryRunner.query(schemaSql);
      await queryRunner.query(sectionsSqlCode);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
