import ObjectUtils from 'api/test/utils/object.utils';
import { TestManager } from 'api/test/utils/test-manager';

describe('Page Sections API', () => {
  let testManager: TestManager<unknown>;
  let authToken: string;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    await testManager.clearDatabase();
    const { jwtToken } = await testManager.setUpTestUser();
    authToken = jwtToken;
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  it('Should allow anonymous users to read page sections', async () => {
    // When
    const res = await testManager.request().get('/sections');

    // Then
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it('Should allow authenticated users to read page sections with its widgets', async () => {
    // Given
    const entityMocks = testManager.mocks();
    const sections = [
      await entityMocks.createSection({
        slug: 'section-1',
        name: 'Section 1',
        description: ':)',
        order: 1,
        baseWidgets: [
          await entityMocks.createBaseWidget({ sectionOrder: 1 }),
          await entityMocks.createBaseWidget({ sectionOrder: 2 }),
        ],
      }),
      await entityMocks.createSection({
        slug: 'section-2',
        name: 'Section 2',
        description: ':)',
        order: 2,
        baseWidgets: [],
      }),
    ];

    // When
    const res = await testManager
      .request()
      .get('/sections') // Implicit ?include[]=baseWidgets&sort[]=order&sort[]=baseWidget.sectionOrder
      .set('Authorization', `Bearer ${authToken}`);

    // Then
    const bodyData = res.body.data;
    expect(bodyData).toHaveLength(2);
    expect(bodyData).toStrictEqual(ObjectUtils.normalizeDates(sections));
  });
});
