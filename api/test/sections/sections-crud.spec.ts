import ObjectUtils from 'api/test/utils/object.utils';
import { TestManager } from 'api/test/utils/test-manager';

describe('Page Sections API', () => {
  let testManager: TestManager<unknown>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  it('Should allow users to read page sections with its widgets', async () => {
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
    const res = await testManager.request().get('/sections'); // Implicit ?include[]=baseWidgets&sort[]=order&sort[]=baseWidget.sectionOrder

    // Then
    const bodyData = res.body.data;
    expect(bodyData).toHaveLength(2);
    // TODO: Once we figure out how to e2e tests this, we need to assert that the data in each widget in properly computed, along with filters etc
    //expect(bodyData).toStrictEqual(ObjectUtils.normalizeDates(sections));
  });
});
