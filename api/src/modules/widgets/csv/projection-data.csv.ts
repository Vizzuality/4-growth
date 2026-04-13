import { stringify } from 'csv-stringify/sync';
import { CustomProjection } from '@shared/dto/projections/custom-projection.type';
import { ProjectionWidgetData } from '@shared/dto/projections/projection-widget.entity';
import { NonExportableWidgetError } from '@api/modules/widgets/csv/widget-data.csv';

type ProjectionRow = Record<string, unknown>;

export type ProjectionLikeData = CustomProjection | ProjectionWidgetData;

export function serializeProjectionDataToCsv(data: ProjectionLikeData): string {
  const sampleRow = findFirstRow(data);
  if (sampleRow === null) {
    throw new NonExportableWidgetError('projection has no data');
  }

  if (isBreakdownRow(sampleRow)) {
    return serializeBreakdown(data as Record<string, BreakdownGroup[]>);
  }

  const columns = inferFlatColumns(sampleRow);
  const rows: ProjectionRow[] = [];
  for (const [unit, unitRows] of Object.entries(data) as Array<
    [string, unknown[]]
  >) {
    for (const row of unitRows as ProjectionRow[]) {
      rows.push({ unit, ...renameKeys(row) });
    }
  }

  return stringify(rows, {
    header: true,
    columns: ['unit', ...columns],
  });
}

type BreakdownGroup = {
  label: string;
  data: Array<{ label: string; value: number; total: number }>;
};

function isBreakdownRow(row: unknown): row is BreakdownGroup {
  return (
    typeof row === 'object' &&
    row !== null &&
    'label' in row &&
    'data' in row &&
    Array.isArray((row as BreakdownGroup).data)
  );
}

function findFirstRow(data: ProjectionLikeData): unknown | null {
  for (const rows of Object.values(data)) {
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0];
    }
  }
  return null;
}

function serializeBreakdown(data: Record<string, BreakdownGroup[]>): string {
  const rows: ProjectionRow[] = [];
  for (const [unit, groups] of Object.entries(data)) {
    for (const group of groups) {
      for (const row of group.data) {
        rows.push({
          unit,
          breakdown_label: group.label,
          label: row.label,
          value: row.value,
          total: row.total,
        });
      }
    }
  }
  return stringify(rows, {
    header: true,
    columns: ['unit', 'breakdown_label', 'label', 'value', 'total'],
  });
}

const KEY_RENAMES: Record<string, string> = {
  technologyType: 'technology_type',
};

function renameKeys(row: ProjectionRow): ProjectionRow {
  const renamed: ProjectionRow = {};
  for (const [key, value] of Object.entries(row)) {
    renamed[KEY_RENAMES[key] ?? key] = value;
  }
  return renamed;
}

function inferFlatColumns(sampleRow: unknown): string[] {
  if (typeof sampleRow !== 'object' || sampleRow === null) {
    return [];
  }
  return Object.keys(sampleRow).map((k) => KEY_RENAMES[k] ?? k);
}
