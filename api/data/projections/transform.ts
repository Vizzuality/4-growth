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
  nextId = forestryScenario3.nextId;

  const agricultureBaseline = await ProjectionsParser.parseFromFile(
    __dirname + '/agriculture-baseline.csv',
    {
      category: 'Agriculture',
      scenario: ProjectionScenarios.BASELINE,
      startId: nextId,
    },
  );
  projections.push(...agricultureBaseline.projections);
  nextId = agricultureBaseline.nextId;

  const agricultureScenario1 = await ProjectionsParser.parseFromFile(
    __dirname + '/agriculture-reimagining-progress.csv',
    {
      category: 'Agriculture',
      scenario: ProjectionScenarios.REIMAGINING_PROGRESS,
      startId: nextId,
    },
  );
  projections.push(...agricultureScenario1.projections);
  nextId = agricultureScenario1.nextId;

  const agricultureScenario2 = await ProjectionsParser.parseFromFile(
    __dirname + '/agriculture-fractured-continent.csv',
    {
      category: 'Agriculture',
      scenario: ProjectionScenarios.THE_FRACTURED_CONTINENT,
      startId: nextId,
    },
  );
  projections.push(...agricultureScenario2.projections);
  nextId = agricultureScenario2.nextId;

  const agricultureScenario3 = await ProjectionsParser.parseFromFile(
    __dirname + '/agriculture-corporate-epoch.csv',
    {
      category: 'Agriculture',
      scenario: ProjectionScenarios.THE_CORPORATE_EPOCH,
      startId: nextId,
    },
  );
  projections.push(...agricultureScenario3.projections);

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
