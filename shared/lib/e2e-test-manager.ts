import { DataSource } from 'typeorm';
import { User } from '@shared/dto/users/user.entity';
import { createUser } from '@shared/lib/entity-mocks';
import { clearTestDataFromDatabase } from '@shared/lib/db-helpers';
import { logUserIn } from '@shared/lib/log-user-in';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: '4growth',
  password: '4growth',
  database: '4growth',
  entities: [User],
});

export class E2eTestManager {
  dataSource: DataSource;
  static API_URL = 'http://localhost';
  static API_PORT = 4000;
  static CLIENT_URL = 'http://localhost';
  static CLIENT_PORT = 3000;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  static async load() {
    await AppDataSource.initialize();

    return new E2eTestManager(AppDataSource);
  }

  static getAPIUrl() {
    return `${E2eTestManager.API_URL}:${E2eTestManager.API_PORT}`;
  }
  static getClientUrl() {
    return `${E2eTestManager.CLIENT_URL}:${E2eTestManager.CLIENT_PORT}`;
  }

  async clearDatabase() {
    await clearTestDataFromDatabase(this.dataSource);
  }

  getDataSources() {
    return this.dataSource;
  }

  async close() {
    await this.dataSource.destroy();
  }

  async createUser(additionalData?: Partial<User>) {
    return createUser(this.dataSource, additionalData);
  }

  async setUpTestUser() {
    const user = await this.createUser();
    return logUserIn(E2eTestManager.getAPIUrl(), user);
  }
}
