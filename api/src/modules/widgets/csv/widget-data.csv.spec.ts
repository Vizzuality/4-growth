import { serializeWidgetDataToCsv } from '@api/modules/widgets/csv/widget-data.csv';
import { WidgetData } from '@shared/dto/widgets/base-widget-data.interface';

describe('serializeWidgetDataToCsv', () => {
  it('serializes a counter (single_value) widget', () => {
    const data: WidgetData = { counter: { value: 3, total: 5 } };
    expect(serializeWidgetDataToCsv(data)).toBe('value,total\n3,5\n');
  });

  it('serializes a chart widget (bar/pie/area)', () => {
    const data: WidgetData = {
      chart: [
        { label: 'Agriculture', value: 2, total: 5 },
        { label: 'Forestry', value: 3, total: 5 },
      ],
    };
    expect(serializeWidgetDataToCsv(data)).toBe(
      'label,value,total\nAgriculture,2,5\nForestry,3,5\n',
    );
  });

  it('serializes a map widget', () => {
    const data: WidgetData = {
      map: [
        { country: 'Belgium', value: 40 },
        { country: 'Spain', value: 60 },
      ],
    };
    expect(serializeWidgetDataToCsv(data)).toBe(
      'country,value\nBelgium,40\nSpain,60\n',
    );
  });

  it('serializes a breakdown widget in long format', () => {
    const data: WidgetData = {
      breakdown: [
        {
          label: 'Austria',
          data: [{ label: 'Forestry', value: 1, total: 1 }],
        },
        {
          label: 'Belgium',
          data: [
            { label: 'Agriculture', value: 2, total: 2 },
            { label: 'Forestry', value: 1, total: 2 },
          ],
        },
      ],
    };
    expect(serializeWidgetDataToCsv(data)).toBe(
      'breakdown_label,label,value,total\n' +
        'Austria,Forestry,1,1\n' +
        'Belgium,Agriculture,2,2\n' +
        'Belgium,Forestry,1,2\n',
    );
  });

  it('escapes commas, quotes and newlines in string fields', () => {
    const data: WidgetData = {
      chart: [
        { label: 'Hello, world', value: 1, total: 2 },
        { label: 'She said "hi"', value: 1, total: 2 },
      ],
    };
    expect(serializeWidgetDataToCsv(data)).toBe(
      'label,value,total\n' +
        '"Hello, world",1,2\n' +
        '"She said ""hi""",1,2\n',
    );
  });

  it('returns header only when chart/breakdown/map is empty', () => {
    expect(serializeWidgetDataToCsv({ chart: [] })).toBe('label,value,total\n');
    expect(serializeWidgetDataToCsv({ map: [] })).toBe('country,value\n');
    expect(serializeWidgetDataToCsv({ breakdown: [] })).toBe(
      'breakdown_label,label,value,total\n',
    );
  });

  it('throws when the widget has no exportable data (navigation)', () => {
    const data: WidgetData = { navigation: { href: '/somewhere' } };
    expect(() => serializeWidgetDataToCsv(data)).toThrow(/cannot be exported/i);
  });

  it('throws when the widget data object is empty', () => {
    expect(() => serializeWidgetDataToCsv({})).toThrow(/cannot be exported/i);
  });
});
