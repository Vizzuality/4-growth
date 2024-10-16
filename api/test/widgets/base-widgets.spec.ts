import { TestManager } from 'api/test/utils/test-manager';
import { WidgetVisualizationsType } from '@shared/dto/widgets/widget-visualizations.constants';

describe('Base Widgets', () => {
  let testManager: TestManager<unknown>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  it('Should get all available base widgets filtered by visualisation type', async () => {
    const vizzes = [
      ['map', 'area_graph'],
      ['bar_chart', 'line_chart'],
      ['pie_chart', 'horizontal_bar chart'],
      ['single_value', 'filter'],
      ['navigation', 'map'],
    ];
    for (const [i, vizz] of vizzes.entries()) {
      await testManager.mocks().createBaseWidget({
        indicator: `Indicator ${i}`,
        visualisations: vizz as WidgetVisualizationsType[],
      });
    }

    const mapAndAreaGraphOnly = await testManager
      .request()
      .get('/widgets')
      .query({ 'visualisations[]': ['map', 'area_graph'] });

    expect(mapAndAreaGraphOnly.body.data).toHaveLength(1);
    expect(mapAndAreaGraphOnly.body.data[0].visualisations).toEqual(vizzes[0]);

    const allWithMap = await testManager
      .request()
      .get('/widgets')
      .query({ 'visualisations[]': ['map'] });

    expect(allWithMap.body.data).toHaveLength(2);
    allWithMap.body.data.forEach((widget: any) => {
      expect(widget.visualisations).toContain('map');
    });

    const noneFound = await testManager
      .request()
      .get('/widgets')
      .query({
        'visualisations[]': ['map', 'area_graph', 'horizontal_bar_chart'],
      });

    expect(noneFound.body.data).toHaveLength(0);
  });
});
