import { AppModule } from '@api/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { clearTestDataFromDatabase } from '@shared/lib/db-helpers';
import { createUser } from '@shared/lib/entity-mocks';
import { Type } from '@nestjs/common/interfaces';
import * as request from 'supertest';
import { User } from '@shared/dto/users/user.entity';
import { logUserIn } from '@shared/lib/log-user-in';

/**
 * @description: Abstraction for NestJS testing workflow. For now its a basic implementation to create a test app, but can be extended to encapsulate
 * common testing utilities
 */

export class TestManager<FixtureType> {
  testApp: INestApplication;
  dataSource: DataSource;
  moduleFixture: TestingModule;
  fixtures?: FixtureType;
  constructor(
    testApp: INestApplication,
    dataSource: DataSource,
    moduleFixture: TestingModule,
    options?: { fixtures: FixtureType },
  ) {
    this.testApp = testApp;
    this.dataSource = dataSource;
    this.moduleFixture = moduleFixture;
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
    return new TestManager<FixtureType>(testApp, dataSource, moduleFixture);
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

  getModule<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | Function | string | symbol,
  ): TResult {
    return this.moduleFixture.get(typeOrToken);
  }

  async setUpTestUser() {
    const user = await createUser(this.getDataSource());
    return this.logUserIn(user);
  }

  async logUserIn(user: Partial<User>) {
    return logUserIn(this.getApp().getHttpServer(), user);
  }

  request() {
    return request(this.testApp.getHttpServer());
  }
}
