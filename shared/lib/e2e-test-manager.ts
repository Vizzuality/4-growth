import { DataSource, DeepPartial } from 'typeorm';
import { User } from '@shared/dto/users/user.entity';
import { createCustomWidget, createUser } from '@shared/lib/entity-mocks';
import { clearTestDataFromDatabase } from '@shared/lib/db-helpers';
import { DB_ENTITIES } from '@shared/lib/db-entities';
import { sign } from 'jsonwebtoken';
import { CustomWidget } from '@shared/dto/widgets/custom-widget.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: '4growth',
  password: '4growth',
  database: '4growth',
  entities: DB_ENTITIES,
});

export class E2eTestManager {
  dataSource: DataSource;
  page: any;

  constructor(dataSource: DataSource, page?: any) {
    this.dataSource = dataSource;
    this.page = page;
  }

  static async load(page?: any) {
    await AppDataSource.initialize();

    return new E2eTestManager(AppDataSource, page);
  }

  async clearDatabase() {
    await clearTestDataFromDatabase(this.dataSource);
  }

  getDataSource() {
    return this.dataSource;
  }

  async close() {
    if (this.page) {
      await this.page.close();
    }
    await this.dataSource.destroy();
  }

  async createUser(additionalData?: Partial<User>) {
    return createUser(this.dataSource, additionalData);
  }

  mocks() {
    return {
      createUser: (additionalData?: Partial<User>) =>
        createUser(this.getDataSource(), additionalData),
      createCustomWidget: (
        additionalData?: DeepPartial<CustomWidget>,
      ): Promise<CustomWidget> =>
        createCustomWidget(this.getDataSource(), additionalData),
    };
  }

  getPage() {
    if (!this.page) throw new Error('Playwright Page is not initialized');
    return this.page;
  }

  async login(user?: User) {
    if (!user) {
      user = await this.mocks().createUser();
    }
    await this.page.goto('/auth/signin');
    await this.page.getByLabel('Email').fill(user.email);
    await this.page.locator('input[type="password"]').fill(user.password);
    await this.page.getByRole('button', { name: /log in/i }).click();
    await this.page.waitForURL('/profile');
    return user;
  }

  async logout() {
    await this.page.goto('/auth/api/signout');
    await this.page.getByRole('button', { name: 'Sign out' }).click();
  }

  async generateToken(user: User) {
    // the secret must match the provided for the api when built for e2e tests
    return sign({ id: user.id }, 'mysupersecretfortests');
  }
}
