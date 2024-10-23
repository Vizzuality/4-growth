import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { TestManager } from 'api/test/utils/test-manager';

describe('Page Sections API', () => {
  let testManager: TestManager<unknown>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  it('Should allow users to read page sections with its widgets', async () => {
    // Given
    const dataSourceManager = testManager.testApp.get(DataSourceManager);
    await dataSourceManager.loadQuestionIndicatorMap();
    await dataSourceManager.loadSurveyData(
      `${__dirname}/../../data/surveys.json`,
    );

    const entityMocks = testManager.mocks();
    await entityMocks.createSection({
      slug: 'section-2',
      name: 'Section 2',
      description: ':)',
      order: 2,
      baseWidgets: [
        await entityMocks.createBaseWidget({
          sectionOrder: 1,
          indicator: 'total-surveys',
        }),
      ],
    });
    await entityMocks.createSection({
      slug: 'section-1',
      name: 'Section 1',
      description: ':)',
      order: 1,
      baseWidgets: [
        await entityMocks.createBaseWidget({
          sectionOrder: 1,
          indicator: 'total-countries',
        }),
        await entityMocks.createBaseWidget({
          sectionOrder: 2,
          indicator: 'organisation-by-sector',
        }),
      ],
    });

    // When
    const res = await testManager
      .request()
      .get(
        '/sections?filters[0][name]=eu-member-state&filters[0][operator]==&filters[0][values][0]=Belgium',
      ); // Implicit ?include[]=baseWidgets&sort[]=order&sort[]=baseWidget.sectionOrder

    // Then
    const bodyData = res.body.data;
    expect(bodyData).toHaveLength(2);

    const resSection1 = bodyData[0];
    expect(resSection1.baseWidgets).toHaveLength(2);

    const resSection2 = bodyData[1];
    expect(resSection2.baseWidgets).toHaveLength(1);

    const expectedWidgetData = {
      'total-countries': { counter: { value: 1, total: 4 } },
      'total-surveys': { counter: { value: 2, total: 5 } },
      'organisation-by-sector': {
        chart: [
          {
            label: 'Agriculture',
            total: 2,
            value: 2,
          },
        ],
      },
    };

    // Test section order, widget order and widget data
    for (let sectionIdx = 0; sectionIdx < bodyData.length; sectionIdx++) {
      const section = bodyData[sectionIdx];
      expect(section.slug).toBe(`section-${sectionIdx + 1}`);
      expect(section.order).toBe(sectionIdx + 1);

      const baseWidgets = section.baseWidgets;
      for (let widgetIdx = 0; widgetIdx < baseWidgets.length; widgetIdx++) {
        const widget = baseWidgets[widgetIdx];
        expect(widget.sectionOrder).toBe(widgetIdx + 1);

        expect(widget.data).toEqual(expectedWidgetData[widget.indicator]);
      }
    }
  });
});
