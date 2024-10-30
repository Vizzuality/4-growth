import { TestManager } from 'api/test/utils/test-manager';

describe('Health', () => {
  let testManager: TestManager<unknown>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
  });

  beforeEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  it("Should return the app's health status: OK", async () => {
    // Given
    // The app is running

    // When
    const { statusCode, body } = await testManager.request().get('/health');

    // Then
    expect(statusCode).toBe(200);
    expect(body).toStrictEqual({
      status: 'ok',
      info: { database: { status: 'up' } },
      error: {},
      details: { database: { status: 'up' } },
    });
  });

  it("Should return the app's health status: Unavailable", async () => {
    // Given
    // The app is running and the database becomes unavailable
    await testManager.dataSource.destroy();

    // When
    const { statusCode } = await testManager.request().get('/health');

    // Then
    expect(statusCode).toBe(503);
  });
});
