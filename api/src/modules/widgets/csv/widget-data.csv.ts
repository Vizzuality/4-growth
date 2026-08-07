import { stringify } from 'csv-stringify/sync';
import { WidgetData } from '@shared/dto/widgets/base-widget-data.interface';

export type WidgetDataField = 'counter' | 'chart' | 'map' | 'breakdown';

export class NonExportableWidgetError extends Error {
  constructor(reason: string) {
    super(`Widget cannot be exported: ${reason}`);
    this.name = 'NonExportableWidgetError';
  }
}

export function serializeWidgetDataToCsv(
  data: WidgetData,
  preferredField?: WidgetDataField,
): string {
  const field = resolveField(data, preferredField);

  switch (field) {
    case 'counter':
      return stringify([data.counter!], {
        header: true,
        columns: ['value', 'total'],
      });

    case 'chart':
      return stringify(data.chart!, {
        header: true,
        columns: ['label', 'value', 'total'],
      });

    case 'map':
      return stringify(data.map!, {
        header: true,
        columns: ['country', 'value'],
      });

    case 'breakdown': {
      const rows = data.breakdown!.flatMap((group) =>
        group.data.map((row) => ({
          breakdown_label: group.label,
          label: row.label,
          value: row.value,
          total: row.total,
        })),
      );
      return stringify(rows, {
        header: true,
        columns: ['breakdown_label', 'label', 'value', 'total'],
      });
    }
  }
}

function resolveField(
  data: WidgetData,
  preferredField: WidgetDataField | undefined,
): WidgetDataField {
  if (data.navigation) {
    throw new NonExportableWidgetError(
      'navigation widgets have no tabular data',
    );
  }

  if (preferredField && data[preferredField] !== undefined) {
    return preferredField;
  }

  if (data.counter) return 'counter';
  if (data.chart) return 'chart';
  if (data.map) return 'map';
  if (data.breakdown) return 'breakdown';

  throw new NonExportableWidgetError('no data available');
}
