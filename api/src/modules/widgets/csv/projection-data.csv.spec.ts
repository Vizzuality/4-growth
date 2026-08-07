import { serializeProjectionDataToCsv } from '@api/modules/widgets/csv/projection-data.csv';
import {
  BreakdownProjection,
  BubbleProjection,
  SimpleProjection,
  TableProjection,
} from '@shared/dto/projections/custom-projection.type';

describe('serializeProjectionDataToCsv', () => {
  it('serializes a simple projection (year/vertical/color per unit)', () => {
    const data: SimpleProjection = {
      EUR: [
        { year: 2025, vertical: 100, color: 'Solar' },
        { year: 2026, vertical: 120, color: 'Solar' },
      ],
      USD: [{ year: 2025, vertical: 80, color: 'Wind' }],
    };
    expect(serializeProjectionDataToCsv(data)).toBe(
      'unit,year,vertical,color\n' +
        'EUR,2025,100,Solar\n' +
        'EUR,2026,120,Solar\n' +
        'USD,2025,80,Wind\n',
    );
  });

  it('serializes a bubble projection', () => {
    const data: BubbleProjection = {
      MW: [
        {
          year: 2025,
          bubble: 'Solar',
          color: 'A',
          vertical: 10,
          horizontal: 5,
          size: 2,
        },
      ],
    };
    expect(serializeProjectionDataToCsv(data)).toBe(
      'unit,year,bubble,color,vertical,horizontal,size\n' +
        'MW,2025,Solar,A,10,5,2\n',
    );
  });

  it('serializes a table projection', () => {
    const data: TableProjection = {
      GWh: [
        {
          year: 2025,
          value: 42,
          scenario: 'S1',
          technology: 'Solar',
          technologyType: 'PV',
          country: 'ES',
          category: 'Renewable',
        },
      ],
    };
    expect(serializeProjectionDataToCsv(data)).toBe(
      'unit,year,value,scenario,technology,technology_type,country,category\n' +
        'GWh,2025,42,S1,Solar,PV,ES,Renewable\n',
    );
  });

  it('serializes a breakdown projection in long format', () => {
    const data: BreakdownProjection = {
      GWh: [
        {
          label: 'Spain',
          data: [{ label: 'Solar', value: 10, total: 10 }],
        },
        {
          label: 'France',
          data: [
            { label: 'Solar', value: 5, total: 7 },
            { label: 'Wind', value: 2, total: 7 },
          ],
        },
      ],
    };
    expect(serializeProjectionDataToCsv(data)).toBe(
      'unit,breakdown_label,label,value,total\n' +
        'GWh,Spain,Solar,10,10\n' +
        'GWh,France,Solar,5,7\n' +
        'GWh,France,Wind,2,7\n',
    );
  });

  it('escapes commas and quotes in string fields', () => {
    const data: SimpleProjection = {
      'MW, net': [{ year: 2025, vertical: 1, color: 'Solar "peak"' }],
    };
    expect(serializeProjectionDataToCsv(data)).toBe(
      'unit,year,vertical,color\n' + '"MW, net",2025,1,"Solar ""peak"""\n',
    );
  });

  it('throws when projection has no units with rows', () => {
    expect(() => serializeProjectionDataToCsv({})).toThrow(
      /cannot be exported/i,
    );
    expect(() => serializeProjectionDataToCsv({ EUR: [] })).toThrow(
      /cannot be exported/i,
    );
  });
});
