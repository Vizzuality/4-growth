import { TestManager } from 'api/test/utils/test-manager';

describe('Page Filters API', () => {
  let testManager: TestManager<unknown>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
  });

  afterAll(async () => {
    await testManager.close();
  });

  it('Should allow users to retrieve all page filters', async () => {
    // When
    const res = await testManager.request().get('/filters');

    // Then
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
