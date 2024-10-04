import * as fs from 'fs';
import { Options, parse } from 'csv-parse';

const GROUP_HEADING_REGEX = /^\(.*\)$/;

const isGroupHeadingRow = (row: string[]): boolean => {
  for (let idx = 0; idx < row.length; idx++) {
    const column = row[idx];
    if (GROUP_HEADING_REGEX.test(column) === true) {
      return true;
    }
  }
  return false;
};

const parseFromFile = async (
  filePath: string,
  parsingOpts: Options = { delimiter: ',' },
) => {
  let pageFilters: { name: string; values: string[] }[] = [];
  await new Promise<void>((resolve) => {
    const csvParser = parse(parsingOpts);

    csvParser.on('readable', () => {
      const rowIdxGroupNameMap = {};
      const groupNameFilters = {};
      let row: string[];
      while ((row = csvParser.read()) != null) {
        if (isGroupHeadingRow(row) === true) {
          for (let idx = 0; idx < row.length; idx++) {
            const column = row[idx];
            if (GROUP_HEADING_REGEX.test(column) === true) {
              rowIdxGroupNameMap[idx] = column;
            }
          }
          continue;
        }

        for (let idx = 0; idx < row.length; idx++) {
          const column = row[idx];
          if (column === '') continue;

          const groupName = rowIdxGroupNameMap[idx];
          if (!(groupName in groupNameFilters)) {
            groupNameFilters[groupName] = [];
          }

          groupNameFilters[groupName].push(column);
        }
      }

      const groupNameFilterKeys = Object.keys(groupNameFilters);
      if (groupNameFilterKeys.length > 0) {
        pageFilters = Object.keys(groupNameFilters).map((key) => ({
          name: key
            .toLocaleLowerCase()
            .replace(/[\(\)]/g, '')
            .replace(/ /g, '-'),
          values: groupNameFilters[key],
        }));
      }
    });

    csvParser.on('error', (err) => {
      console.error(err);
      throw err;
    });

    csvParser.on('end', () => {
      resolve();
    });

    const fileContents = fs.readFileSync(filePath, 'utf-8');
    csvParser.write(fileContents);
    csvParser.end();
  });

  return pageFilters;
};

export const PageFiltersCSVParser = {
  parseFromFile,
};

// parseFromFile('data/page-filters/page-filters.csv', { delimiter: ',' }).then(
//   (r) =>
//     fs.writeFileSync(
//       'data/page-filters/page-filters.json',
//       JSON.stringify(r, null, 2),
//     ),
// );
