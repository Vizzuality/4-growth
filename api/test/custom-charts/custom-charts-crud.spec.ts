import { TestManager } from '../utils/test-manager';
import { User } from '@shared/dto/users/user.entity';
import { CustomChart } from '@shared/dto/custom-charts/custom-chart.entity';

describe('Custom Charts CRUD', () => {
  let testManager: TestManager<any>;
  let authToken: string;
  let testUser: User;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
  });
  beforeEach(async () => {
    const { jwtToken, user } = await testManager.setUpTestUser();
    authToken = jwtToken;
    testUser = user;
  });
  afterEach(async () => {
    await testManager.clearDatabase();
  });

  it('should get all custom charts', async () => {
    const customCharts: CustomChart[] = [];
    for (const n of Array(3).keys()) {
      customCharts.push(await testManager.mocks().createCustomChart(testUser));
    }
    const response = await testManager
      .request()
      .get('/custom-charts')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(customCharts.length); // + 1 for the test user
  });
  it('should get a custom chart by its ID', async () => {
    const customChart = await testManager.mocks().createCustomChart(testUser);
    const response = await testManager
      .request()
      .get('/custom-charts/' + customChart.id)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toEqual(customChart.id);
  });
});
