import { ProjectionScenarios } from '@shared/dto/projections/projection-types';
import * as fs from 'fs';
import { cloneDeep } from 'lodash';

const main = async () => {
  const jsonData = JSON.parse(
    fs.readFileSync(`${__dirname}/mock-projections.json`, 'utf-8'),
  );

  console.log('mock-projections.json', jsonData.length);

  let latestId: number = 0;
  const jsonDataWithSections = [];
  for (let idx = 0; idx < jsonData.length; idx++) {
    const entry = jsonData[idx];

    if (latestId < entry.id) {
      latestId = entry.id;
    }

    jsonDataWithSections.push({
      scenario: ProjectionScenarios.BASELINE,
      ...entry,
    });
  }

  for (let idx = 0; idx < jsonData.length; idx++) {
    const entry = jsonData[idx];

    const clonedEntry = cloneDeep(entry);
    const currentId = ++latestId;
    clonedEntry.id = currentId;
    clonedEntry.scenario = ProjectionScenarios.REIMAGINING_PROGRESS;

    for (const projectionData of clonedEntry.projectionData) {
      projectionData.projection.id = currentId;
    }
    jsonDataWithSections.push(clonedEntry);
  }

  for (let idx = 0; idx < jsonData.length; idx++) {
    const entry = jsonData[idx];

    const clonedEntry = cloneDeep(entry);
    const currentId = ++latestId;
    clonedEntry.id = currentId;
    clonedEntry.scenario = ProjectionScenarios.THE_CORPORATE_EPOCH;

    for (const projectionData of clonedEntry.projectionData) {
      projectionData.projection.id = currentId;
    }
    jsonDataWithSections.push(clonedEntry);
  }

  for (let idx = 0; idx < jsonData.length; idx++) {
    const entry = jsonData[idx];

    const clonedEntry = cloneDeep(entry);
    const currentId = ++latestId;
    clonedEntry.id = currentId;
    clonedEntry.scenario = ProjectionScenarios.THE_FRACTURED_CONTINENT;

    for (const projectionData of clonedEntry.projectionData) {
      projectionData.projection.id = currentId;
    }
    jsonDataWithSections.push(clonedEntry);
  }

  console.log(
    'mock-projections-with-sections.json',
    jsonDataWithSections.length,
  );
  const filePath = `${__dirname}/mock-projections-with-sections.json`;
  fs.writeFileSync(
    filePath,
    JSON.stringify(jsonDataWithSections, null, 2),
    'utf-8',
  );
  console.log(`Data written to ${filePath}`);
};

void main();
