import { DataSource } from 'typeorm';
import { User } from '@shared/dto/users/user.entity';
import { createUser } from '@shared/lib/entity-mocks';
import { clearTestDataFromDatabase } from '@shared/lib/db-helpers';

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

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  static async load() {
    await AppDataSource.initialize();

    return new E2eTestManager(AppDataSource);
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
}
