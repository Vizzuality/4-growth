import * as fs from 'fs';
import * as path from 'path';
import { ProjectionsParser } from 'api/data/projections/projections.parser';
import {
  ProjectionScenarios,
  PROJECTION_TYPES,
} from '@shared/dto/projections/projection-types';
import { Projection } from '@shared/dto/projections/projection.entity';

export const runTransform = async (
  csvDir: string,
  outPath: string,
): Promise<void> => {
  const projections: Projection[] = [];
  let nextId = 1;
  const unknownIndicators = new Set<string>();
  const unknownCountries = new Set<string>();

  const parse = async (
    file: string,
    category: string,
    scenario: string,
  ): Promise<void> => {
    const result = await ProjectionsParser.parseFromFile(
      path.join(csvDir, file),
      { category, scenario, startId: nextId },
    );
    projections.push(...result.projections);
    nextId = result.nextId;
    result.unknownIndicators.forEach((s) => unknownIndicators.add(s));
    result.unknownCountries.forEach((s) => unknownCountries.add(s));
  };

  await parse('forestry-baseline.csv', 'Forestry', ProjectionScenarios.BASELINE);
  await parse('forestry-reimagining-progress.csv', 'Forestry', ProjectionScenarios.REIMAGINING_PROGRESS);
  await parse('forestry-fractured-continent.csv', 'Forestry', ProjectionScenarios.THE_FRACTURED_CONTINENT);
  await parse('forestry-corporate-epoch.csv', 'Forestry', ProjectionScenarios.THE_CORPORATE_EPOCH);
  await parse('agriculture-baseline.csv', 'Agriculture', ProjectionScenarios.BASELINE);
  await parse('agriculture-reimagining-progress.csv', 'Agriculture', ProjectionScenarios.REIMAGINING_PROGRESS);
  await parse('agriculture-fractured-continent.csv', 'Agriculture', ProjectionScenarios.THE_FRACTURED_CONTINENT);
  await parse('agriculture-corporate-epoch.csv', 'Agriculture', ProjectionScenarios.THE_CORPORATE_EPOCH);

  const emptyTypes = Object.values(PROJECTION_TYPES).filter(
    (type) => !projections.some((p) => p.type === type),
  );
  if (emptyTypes.length > 0) {
    if (unknownIndicators.size > 0) {
      console.error('Unknown indicators (discarded):', [...unknownIndicators]);
    }
    if (unknownCountries.size > 0) {
      console.error('Unknown countries (discarded):', [...unknownCountries]);
    }
    throw new Error(`Zero rows for projection types: ${emptyTypes.join(', ')}`);
  }

  if (unknownIndicators.size > 0) {
    console.warn('Unknown indicators (discarded):', [...unknownIndicators]);
  }
  if (unknownCountries.size > 0) {
    console.warn('Unknown countries (discarded):', [...unknownCountries]);
  }

  const jsonString = JSON.stringify(projections);
  await fs.promises.writeFile(outPath, jsonString);
  console.log(`Data written to ${outPath} with ${projections.length} projections`);
};

const main = async () => {
  try {
    await runTransform(__dirname, path.join(__dirname, 'projections.json'));
  } catch (err) {
    console.error('Transform failed:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  void main();
}
