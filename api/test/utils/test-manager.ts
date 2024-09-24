import { AppModule } from '@api/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DataSource, DeepPartial } from 'typeorm';
import { clearTestDataFromDatabase } from '@shared/lib/db-helpers';
import {
  createBaseWidget,
  createCustomWidget,
  createSection,
  createUser,
} from '@shared/lib/entity-mocks';
import { logUserIn } from './user.auth';
import { Type } from '@nestjs/common/interfaces';
import * as request from 'supertest';
import { User } from '@shared/dto/users/user.entity';
import { getDataSourceToken } from '@nestjs/typeorm';
import { Section } from '@shared/dto/sections/section.entity';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { CustomWidget } from '@shared/dto/widgets/custom-widget.entity';

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

  static async createTestManager<FixtureType = void>(
    options: {
      fixtures?: FixtureType;
      logger?: Logger | false;
    } = {},
  ) {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    // moduleFixture.useLogger(false);
    const dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
    const testApp = moduleFixture.createNestApplication();
    if (options.logger !== undefined) {
      // Has to be called before init. Otherwise it has no effect.
      testApp.useLogger(false);
    }
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

  async setUpTestUser(additionalData?: Partial<User>) {
    const user = await createUser(this.getDataSource(), additionalData);
    return logUserIn(this, user);
  }

  async logUserIn(user: Partial<User>) {
    return logUserIn(this, user);
  }

  request() {
    return request(this.testApp.getHttpServer());
  }

  mocks() {
    return {
      createUser: (additionalData: Partial<User>) =>
        createUser(this.getDataSource(), additionalData),
      createBaseWidget: (
        additionalData?: DeepPartial<BaseWidget>,
      ): Promise<BaseWidget> =>
        createBaseWidget(this.getDataSource(), additionalData),
      createSection: (additionalData: DeepPartial<Section>) =>
        createSection(this.getDataSource(), additionalData),
      createCustomWidget: (
        additionalData?: DeepPartial<CustomWidget>,
      ): Promise<CustomWidget> =>
        createCustomWidget(this.getDataSource(), additionalData),
    };
  }
}
