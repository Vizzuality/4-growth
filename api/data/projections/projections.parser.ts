import {
  PROJECTION_TYPES,
  ProjectionType,
} from '@shared/dto/projections/projection-types';
import { Projection } from '@shared/dto/projections/projection.entity';
import { CountryISOMap } from '@shared/constants/country-iso.map';
import * as fs from 'fs';
import { ProjectionData } from '@shared/dto/projections/projection-data.entity';
import { ProjectionScenarios } from '@shared/dto/projections/projection-types';
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
  if (
    trimmed === 'No. of subscriptions' ||
    trimmed === 'No.of subsriptions'
  ) {
    return 'No. of subscriptions';
  }
  return trimmed;
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

  // Skip header row (index 0), iterate data rows
  for (let idx = 1; idx < lines.length; idx++) {
    const row = lines[idx];
    if (!row || row.length < 30) continue;

    const indicatorRaw = row[29];
    const type = mapIndicatorToType(indicatorRaw);
    if (!type) continue;

    const countryName = row[6]?.trim();
    const country = CountryISOMap.getISO3ByCountryName(countryName);
    if (!country) continue;

    const rawUnit = row[7];
    const unit = normalizeUnit(rawUnit);

    const id = currentId++;
    const projectionData: ProjectionData[] = [];

    // Columns 8-28 correspond to years 2020-2040
    for (let i = 8; i <= 28; i++) {
      const year = 2012 + i; // 2012 + 8 = 2020, 2012 + 28 = 2040
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
      subsegment: row[3]?.trim(),
      application: 'Total',
      technologyType: row[4]?.trim(),
      region: row[5]?.trim(),
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
