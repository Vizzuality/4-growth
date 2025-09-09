import * as fs from 'fs';
import { ProjectionsParser } from 'api/data/projections/projections.parser';
import { ProjectionScenarios } from '@shared/dto/projections/projection-types';
import { Projection } from '@shared/dto/projections/projection.entity';

const main = async () => {
  const projections: Projection[] = [];
  let nextId = 1;

  const forestryBaseline = await ProjectionsParser.parseFromFile(
    __dirname + '/forestry-baseline.csv',
    {
      category: 'Forestry',
      scenario: ProjectionScenarios.BASELINE,
      startId: nextId,
    },
  );
  projections.push(...forestryBaseline.projections);
  nextId = forestryBaseline.nextId;

  const forestryScenario1 = await ProjectionsParser.parseFromFile(
    __dirname + '/forestry-reimagining-progress.csv',
    {
      category: 'Forestry',
      scenario: ProjectionScenarios.REIMAGINING_PROGRESS,
      startId: nextId,
    },
  );
  projections.push(...forestryScenario1.projections);
  nextId = forestryScenario1.nextId;

  const forestryScenario2 = await ProjectionsParser.parseFromFile(
    __dirname + '/forestry-fractured-continent.csv',
    {
      category: 'Forestry',
      scenario: ProjectionScenarios.THE_FRACTURED_CONTINENT,
      startId: nextId,
    },
  );
  projections.push(...forestryScenario2.projections);
  nextId = forestryScenario2.nextId;

  const forestryScenario3 = await ProjectionsParser.parseFromFile(
    __dirname + '/forestry-corporate-epoch.csv',
    {
      category: 'Forestry',
      scenario: ProjectionScenarios.THE_CORPORATE_EPOCH,
      startId: nextId,
    },
  );
  projections.push(...forestryScenario3.projections);

  const jsonString = JSON.stringify(projections, null, 2);
  const filePath = __dirname + '/projections.json';
  await fs.promises.writeFile(filePath, jsonString);
  console.log(
    `Data written to ${filePath} with ${projections.length} projections`,
  );
};

if (require.main === module) {
  void main();
}
