import { SectionsCSVParser } from 'api/data/sections/sections-csv-parser';
import { Logger } from '@nestjs/common';
import { SQLAdapter } from '@api/infrastructure/sql-adapter';
import { readFileSync, writeFileSync } from 'fs';
import { SectionsJSONParser } from 'api/data/sections/sections-json-parser';

const main = async () => {
  // const sections = await SectionsCSVParser.parseSectionsFromFile(
  //   `${__dirname}/chart-types.csv`,
  //   { delimiter: ';' },
  // );
  // const array = Object.values(sections);
  // console.log(array);
  // writeFileSync(`${__dirname}/sections.json`, JSON.stringify(array, null, 2));
  // const sqlAdapter = new SQLAdapter(new Logger());
  // const sqlCode = sqlAdapter.generateSqlFromSections(sections);
  // console.log(sqlCode);
  SectionsJSONParser.parseSectionsFromFile(`${__dirname}/sections.json`);
};

void main();
