import {
  PROJECTION_TYPES,
  ProjectionType,
} from '@shared/dto/projections/projection-types';
import { Projection } from '@shared/dto/projections/projection.entity';
import { CountryISOMap } from '@shared/constants/country-iso.map';
import * as fs from 'fs';
import { ProjectionData } from '@shared/dto/projections/projection-data.entity';
import { parse } from 'csv-parse/sync';

const mapIndicatorToType = (indicator: string): ProjectionType | null => {
  const map: Record<string, ProjectionType> = {
    market_potential: PROJECTION_TYPES.MARKET_POTENTIAL,
    addressable_market: PROJECTION_TYPES.ADDRESSABLE_MARKET,
    penetration: PROJECTION_TYPES.PENETRATION,
    shipments: PROJECTION_TYPES.SHIPMENTS,
    installed_base: PROJECTION_TYPES.INSTALLED_BASE,
    prices: PROJECTION_TYPES.PRICES,
    revenues: PROJECTION_TYPES.REVENUES,
  };
  return map[indicator.trim()] ?? null;
};

const normalizeUnit = (rawUnit: string): string => {
  const trimmed = rawUnit.trim();
  if (trimmed === 'EUR') return 'EUR';
  if (trimmed === 'Unit') return 'Units';
  if (trimmed === 'Area (Ha)') return 'Area (ha)';
  if (trimmed === 'No. of subscriptions' || trimmed === 'No.of subsriptions') {
    return 'No. of subscriptions';
  }
  return trimmed;
};

const DEFAULT_UNIT_BY_TYPE: Record<string, string> = {
  [PROJECTION_TYPES.PENETRATION]: '%',
  [PROJECTION_TYPES.PRICES]: 'EUR',
  [PROJECTION_TYPES.REVENUES]: 'EUR',
  [PROJECTION_TYPES.ADDRESSABLE_MARKET]: 'EUR',
  [PROJECTION_TYPES.SHIPMENTS]: 'Units',
  [PROJECTION_TYPES.INSTALLED_BASE]: 'Units',
};

const parseFromFile = async (
  filePath: string,
  opts: { category?: string; scenario?: string; startId?: number } = {},
) => {
  const { category, scenario, startId = 1 } = opts;

  const fileContent = await fs.promises.readFile(filePath, 'utf-8');
  const lines: string[][] = parse(fileContent, {
    skip_empty_lines: true,
    relaxQuotes: true,
  });

  const result: Projection[] = [];
  let currentId = startId;

  // Detect format from header row content.
  // Forestry: 30 cols (Tech#, Technology, Subseg#, Subsegment, TechType, Region, Country, Unit, 2020..2040, Indicator)
  // Agriculture baseline: 29 cols (Tech#, Technology, TechSubcategory, TechType, Units, Region, Country, 2020..2040, Indicator)
  // Agriculture scenarios: 28 cols (Tech#, Technology, TechSubcategory, TechType, Region, Country, 2020..2040, Indicator) — no Units column
  const header = lines[0];
  const hasUnitsCol = header?.some((h) => h.trim().toLowerCase() === 'units');
  const colCount = header?.length ?? 0;
  const isForestry = colCount >= 30;

  // Build column index map based on detected format
  const col = isForestry
    ? {
        subsegment: 3,
        techType: 4,
        unit: 7,
        region: 5,
        country: 6,
        yearStart: 8,
        yearEnd: 28,
        indicator: 29,
        minCols: 30,
      }
    : hasUnitsCol
      ? {
          subsegment: 2,
          techType: 3,
          unit: 4,
          region: 5,
          country: 6,
          yearStart: 7,
          yearEnd: 27,
          indicator: 28,
          minCols: 29,
        }
      : {
          subsegment: 2,
          techType: 3,
          unit: -1,
          region: 4,
          country: 5,
          yearStart: 6,
          yearEnd: 26,
          indicator: 27,
          minCols: 28,
        };

  // Skip header row (index 0), iterate data rows
  for (let idx = 1; idx < lines.length; idx++) {
    const row = lines[idx];
    if (!row || row.length < col.minCols) continue;

    const indicatorRaw = row[col.indicator];
    const type = mapIndicatorToType(indicatorRaw);
    if (!type) continue;

    const countryName = row[col.country]?.trim();
    const country = CountryISOMap.getISO3ByCountryName(countryName);
    if (!country) continue;

    const rawUnit = col.unit >= 0 ? row[col.unit] : '';
    const unit =
      normalizeUnit(rawUnit) || DEFAULT_UNIT_BY_TYPE[type] || 'Units';

    const id = currentId++;
    const projectionData: ProjectionData[] = [];

    for (let i = col.yearStart; i <= col.yearEnd; i++) {
      const year = 2020 + (i - col.yearStart);
      const value = Number.parseFloat(row[i]);
      projectionData.push({
        projection: { id } as Projection,
        year,
        value,
      });
    }

    result.push({
      id,
      category,
      type,
      scenario,
      technology: row[1]?.trim(),
      subsegment: row[col.subsegment]?.trim() || 'Total',
      application: 'Total',
      technologyType: row[col.techType]?.trim(),
      region: row[col.region]?.trim(),
      unit,
      country,
      projectionData,
    });
  }

  return { projections: result, nextId: currentId };
};

export const ProjectionsParser = {
  parseFromFile,
};
