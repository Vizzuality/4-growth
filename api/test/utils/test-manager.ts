import { AppModule } from '@api/app.module';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { clearTestDataFromDatabase } from './db-helpers';

/**
 * @description: Abstraction for NestJS testing workflow. For now its a basic implementation to create a test app, but can be extended to encapsulate
 * common testing utilities
 */

export class TestManager<FixtureType> {
  testApp: INestApplication;
  dataSource: DataSource;
  fixtures?: FixtureType;
  constructor(
    testApp: INestApplication,
    dataSource: DataSource,
    options?: { fixtures: FixtureType },
  ) {
    this.testApp = testApp;
    this.dataSource = dataSource;
    this.fixtures = options?.fixtures;
  }

  static async createTestManager<FixtureType>(options?: {
    fixtures: FixtureType;
  }) {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const dataSource = moduleFixture.get<DataSource>(DataSource);
    const testApp = moduleFixture.createNestApplication();
    testApp.useGlobalPipes(new ValidationPipe());
    await testApp.init();
    return new TestManager<FixtureType>(testApp, dataSource);
  }

  async clearDatabase() {
    await clearTestDataFromDatabase(this.dataSource);
  }

  getApp() {
    return this.testApp;
  }

  getDataSource() {
    return this.dataSource;
  }

  close() {
    return this.testApp.close();
  }
}
