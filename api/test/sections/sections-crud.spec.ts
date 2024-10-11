import { DataSourceManager } from '@api/infrastructure/data-source-manager';
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
    const dataSourceManager = testManager.testApp.get(DataSourceManager);
    await dataSourceManager.loadMockData();

    const entityMocks = testManager.mocks();
    await entityMocks.createSection({
      slug: 'section-1',
      name: 'Section 1',
      description: ':)',
      order: 1,
      baseWidgets: [
        await entityMocks.createBaseWidget({
          sectionOrder: 1,
          indicator: 'Total countries',
        }),
        await entityMocks.createBaseWidget({
          sectionOrder: 2,
          indicator: 'Non-existent indicator',
        }),
        await entityMocks.createBaseWidget({
          sectionOrder: 3,
          indicator: 'Organisation by sector',
        }),
      ],
    });

    await entityMocks.createSection({
      slug: 'section-2',
      name: 'Section 2',
      description: ':)',
      order: 2,
      baseWidgets: [
        await entityMocks.createBaseWidget({
          sectionOrder: 1,
          indicator: 'Total surveys',
        }),
      ],
    });

    // When
    const res = await testManager
      .request()
      .get(
        '/sections?filters[0][name]=eu-member-state&filters[0][operator]==&filters[0][values]=Spain&filters[0][values]=France',
      ); // Implicit ?include[]=baseWidgets&sort[]=order&sort[]=baseWidget.sectionOrder

    // Then
    const bodyData = res.body.data;
    expect(bodyData).toHaveLength(2);

    const section1 = bodyData[0];
    expect(section1.baseWidgets).toHaveLength(3);

    const section2 = bodyData[1];
    expect(section2.baseWidgets).toHaveLength(1);

    // TODO: Once we figure out how to e2e tests this, we need to assert that the data in each widget in properly computed, along with filters etc
    //expect(bodyData).toStrictEqual(ObjectUtils.normalizeDates(sections));
  });
});
