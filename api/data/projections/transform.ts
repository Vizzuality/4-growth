import * as fs from 'fs';
import { MockProjectionsParser } from 'api/data/projections/mock-projections.parser';

const main = async () => {
  const jsonData = await MockProjectionsParser.parseFromFile(
    __dirname + '/mock-projections.csv',
  );

  const jsonString = JSON.stringify(jsonData, null, 2);
  const filePath = __dirname + '/mock-projections.json';
  await fs.promises.writeFile(filePath, jsonString);
  console.log(`Data written to ${filePath}`);
};

void main();
