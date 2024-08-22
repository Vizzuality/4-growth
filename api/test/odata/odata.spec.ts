import { TestManager } from '../utils/test-manager';
import { User } from '@shared/dto/users/user.entity';
import { createUser } from '@shared/lib/entity-mocks';
import { CustomChart } from '@shared/dto/custom-charts/custom-chart.entity';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { DataSource } from 'typeorm';

/**
 * This test file is provisional to check the OData integration. In the future, it will match the current approach, i.e, instead of being called OData,
 * it should be called Survey Reponses, to be agnostic of the underlying technology to retrieve data
 */
export const ODataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  username: '4growth',
  password: '4growth',
  database: '4growth-odata',
});

describe('OData Integration', () => {
  let testManager: TestManager<any>;
  let authToken: string;
  let testUser: User;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    const sqlFilePath = path.resolve(__dirname, 'survey-responses.mock.sql');
    const content = fs.readFileSync(sqlFilePath, 'utf-8');
    await ODataSource.initialize();
    for (const n of Array(5).keys()) {
      await ODataSource.query(content);
    }
  });
  afterEach(async () => {
    await ODataSource.query('DELETE FROM survey_responses');
  });

  it('It should get all Survey Responses', async () => {
    const response = await testManager.request().get('/survey-responses');
    expect(response.status).toBe(200);
    expect(response.body.value).toHaveLength(5);
  });
});
