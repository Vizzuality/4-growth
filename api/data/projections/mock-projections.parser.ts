import {
  PROJECTION_TYPES,
  ProjectionType,
} from '@shared/dto/projections/projection-types';
import { Projection } from '@shared/dto/projections/projection.entity';
import { CountryISOMap } from '@shared/constants/country-iso.map';
import * as fs from 'fs';
import { ProjectionData } from '@shared/dto/projections/projection-data.entity';

const parseCategory = (
  lines: string[][],
  fromIdx: number,
  toIdx: number,
  type: ProjectionType,
) => {
  const result: Projection[] = [];
  for (let idx = fromIdx; idx < toIdx; idx++) {
    const element = lines[idx];

    const country = CountryISOMap.getISO3ByCountryName(element[10].trim());
    if (!country) continue;

    const id = idx + 1;
    const projectionData: ProjectionData[] = [];
    for (let i = 11; i < 32; i++) {
      const year = 2009 + i;
      const value: any = Number.parseFloat(element[i].replace(/"/g, ''));
      projectionData.push({
        projection: { id } as Projection,
        year,
        value,
      });
    }

    result.push({
      id,
      type,
      scenario: 'best-case',
      technology: element[2].trim(),
      subsegment: element[4].trim(),
      application: element[6].trim(),
      technologyType: element[7].trim(),
      region: element[8].trim(),
      unit: element[9].trim(),
      country: CountryISOMap.getISO3ByCountryName(element[10].trim()),
      projectionData,
    });
  }
  return result;
};

const parseFromFile = async (filePath: string) => {
  const lines = (await fs.promises.readFile(filePath, 'utf-8'))
    .split(/\r\n|\r|\n/)
    .map((line) => line.trim().split(','));

  const marketPotential: Projection[] = parseCategory(
    lines,
    5,
    244,
    PROJECTION_TYPES.MARKET_POTENTIAL,
  );

  const addressableMarket: Projection[] = parseCategory(
    lines,
    248,
    487,
    PROJECTION_TYPES.ADDRESSABLE_MARKET,
  );

  const penetrations: Projection[] = parseCategory(
    lines,
    491,
    695,
    PROJECTION_TYPES.PENETRATION,
  );

  const shipments: Projection[] = parseCategory(
    lines,
    699,
    938,
    PROJECTION_TYPES.SHIPMENTS,
  );

  const installedBase: Projection[] = parseCategory(
    lines,
    942,
    1181,
    PROJECTION_TYPES.INSTALLED_BASE,
  );

  const prices: Projection[] = parseCategory(
    lines,
    1185,
    1219,
    PROJECTION_TYPES.PRICES,
  );

  const revenues: Projection[] = parseCategory(
    lines,
    1223,
    1463,
    PROJECTION_TYPES.REVENUES,
  );

  return [
    ...marketPotential,
    ...addressableMarket,
    ...penetrations,
    ...shipments,
    ...installedBase,
    ...prices,
    ...revenues,
  ];
};

export const MockProjectionsParser = {
  parseFromFile,
};
