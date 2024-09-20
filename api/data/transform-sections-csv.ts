import { SectionsCSVParser } from 'api/data/sections-csv-parser';

const main = async () => {
  const sections = await SectionsCSVParser.parseSectionsFromFile(
    `${__dirname}/survey.csv`,
    { delimiter: ';' },
  );
  console.log(sections);
};

void main();
