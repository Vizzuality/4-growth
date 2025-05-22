import { TestManager } from 'api/test/utils/test-manager';

describe('Projections API', () => {
  let testManager: TestManager<unknown>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });
});
