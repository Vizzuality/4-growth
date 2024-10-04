import { SectionsCSVParser } from 'api/data/sections/sections-csv-parser';
import { SQLAdapter } from '@api/infrastructure/sql-adapter';
import { Logger } from '@nestjs/common';

const main = async () => {
  const sections = await SectionsCSVParser.parseSectionsFromFile(
    `${__dirname}/survey.csv`,
    { delimiter: ';' },
  );
  const sqlAdapter = new SQLAdapter(new Logger());
  const sqlCode = sqlAdapter.generateSqlFromSections(sections);
  console.log(sqlCode);
};

void main();
