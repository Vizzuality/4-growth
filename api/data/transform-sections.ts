import { SectionsCSVParser } from 'api/data/sections-csv-parser';
import { SQLAdapter } from 'api/data/sql-adapter';

const main = async () => {
  const sections = await SectionsCSVParser.parseSectionsFromFile(
    `${__dirname}/survey.csv`,
    { delimiter: ';' },
  );
  const sqlCode = SQLAdapter.generateSqlFromSections(sections);
  console.log(sqlCode);
};

void main();
