import { TestManager } from '../utils/test-manager';
import { User } from '@shared/dto/users/user.entity';
import { CustomChart } from '@shared/dto/custom-charts/custom-chart.entity';

describe('Users Custom Charts', () => {
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
    const user2 = await testManager
      .mocks()
      .createUser({ email: 'user2@charts.com' });
    for (const n of Array(10).keys()) {
      if (n % 2 === 0) {
        await testManager.mocks().createCustomChart(user2, {
          name: user2.email,
        });
      } else {
        await testManager.mocks().createCustomChart(testUser, {
          name: testUser.email,
        });
      }
    }
    const response = await testManager
      .request()
      .get(`/users/${user2.id}/custom-charts`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(5);
    response.body.data.forEach((chart: CustomChart) =>
      expect(chart.name).toEqual(user2.email),
    );
  });
  it('should return an empty array if no custom charts are found for a user', async () => {
    const user2 = await testManager
      .mocks()
      .createUser({ email: 'user2@charts.com' });
    [1, 2, 3].map(
      async () => await testManager.mocks().createCustomChart(user2),
    );
    const response = await testManager
      .request()
      .get(`/users/${testUser.id}/custom-charts`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(0);
  });
});
