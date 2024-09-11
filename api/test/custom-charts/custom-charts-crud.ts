import { TestManager } from '../utils/test-manager';
import { User } from '@shared/dto/users/user.entity';
import { CustomChart } from '@shared/dto/custom-charts/custom-chart.entity';
import { ChartFilter } from '@shared/dto/custom-charts/custom-chart-filter.entity';

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

  describe('GET /custom-charts', () => {
    it('should get all custom charts', async () => {
      const customCharts: CustomChart[] = [];
      for (const n of Array(3).keys()) {
        customCharts.push(
          await testManager
            .mocks()
            .createCustomChart(testUser, { name: `Chart ${n}` }),
        );
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
  describe('PATCH /custom-charts/:id', () => {
    it('should update a custom chart', async () => {
      const customChart = await testManager.mocks().createCustomChart(testUser);
      const response = await testManager
        .request()
        .patch('/custom-charts/' + customChart.id)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' });
      expect(response.status).toBe(200);
      expect(response.body.data.name).toEqual('Updated Name');
    });
    it('should update multiple charts', async () => {
      const customCharts: CustomChart[] = [];
      for (const n of Array(3).keys()) {
        customCharts.push(
          await testManager
            .mocks()
            .createCustomChart(testUser, { name: `Chart ${n}` }),
        );
      }
      const promises = customCharts.map((chart) => {
        return testManager
          .request()
          .patch('/custom-charts/' + chart.id)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: 'Updated Name' });
      });
      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.body.data.name).toEqual('Updated Name');
      });
    });
  });
  describe('DELETE /custom-charts/:id', () => {
    it('should delete a custom chart', async () => {
      const customChart = await testManager.mocks().createCustomChart(testUser);
      const response = await testManager
        .request()
        .delete('/custom-charts/' + customChart.id)
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      const getResponse = await testManager
        .request()
        .get('/custom-charts/' + customChart.id)
        .set('Authorization', `Bearer ${authToken}`);
      expect(getResponse.status).toBe(404);
    });
    it('should delete associated chart filters', async () => {
      const customChart = await testManager.mocks().createCustomChart(testUser);
      for (const n of Array(3).keys()) {
        await testManager.mocks().createChartFilter(customChart);
      }
      const response = await testManager
        .request()
        .delete('/custom-charts/' + customChart.id)
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      const chartFilters = await testManager
        .getDataSource()
        .getRepository(ChartFilter)
        .find();

      expect(chartFilters).toHaveLength(0);
    });
  });
});
