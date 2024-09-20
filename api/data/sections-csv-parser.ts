import * as fs from 'fs';
import { Options, parse } from 'csv-parse';
import { Section } from '@shared/dto/sections/section.entity';
import { DeepPartial } from 'typeorm';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';

const ROW_VISUALIZATION_MAP = {
  4: 'single_value',
  5: 'map',
  6: 'horizontal_bar_chart',
  7: 'pie_chart',
  8: 'area_graph',
} as const;

const parseSectionsFromFile = async (
  filePath: string,
  parsingOpts?: Options,
) => {
  const fileContents = fs.readFileSync(filePath, 'utf-8');

  const sections: Record<string, DeepPartial<Section>> = {};
  await new Promise<void>((resolve) => {
    const csvParser = parse(parsingOpts);

    csvParser.on('readable', () => {
      // Discard headers
      csvParser.read();

      let currentWidgetIdx = 0;
      let currentSectionOrder = 1;
      let currentWidgetSectionOrder = 0;
      let row: any;
      while ((row = csvParser.read()) != null) {
        const indicator = row[2].trim();
        // It is not a widget row
        if (indicator === '') continue;

        const section = row[3].trim() as string;
        const sectionSlug = section.toLocaleLowerCase().replaceAll(' ', '-');

        if (!(sectionSlug in sections)) {
          sections[sectionSlug] = {
            slug: sectionSlug,
            name: section,
            description: section,
            order: ++currentSectionOrder,
            baseWidgets: [] as any,
          };
          currentWidgetSectionOrder = 0;
        }

        const visualisations = [];
        for (let fieldIdx = 4; fieldIdx < 9; fieldIdx++) {
          const field = row[fieldIdx];
          if (field === 'TRUE') {
            visualisations.push(ROW_VISUALIZATION_MAP[fieldIdx]);
          }
        }
        const defaultVisualization = visualisations[0];
        /// Not a valid widget row
        if (defaultVisualization === undefined) continue;
        const question = row[0].trim();
        const baseWidget = {
          id: ++currentWidgetIdx,
          question,
          indicator,
          visualisations,
          defaultVisualization,
          sectionOrder: ++currentWidgetSectionOrder,
          section: sections[sectionSlug].order as any,
        } as BaseWidget;
        sections[sectionSlug].baseWidgets.push(baseWidget);
      }
    });

    csvParser.on('error', (err) => {
      console.error(err);
      throw err;
    });

    csvParser.on('end', () => {
      resolve();
    });

    csvParser.write(fileContents);
    csvParser.end();
  });

  return Object.values(sections);
};

export const SectionsCSVParser = {
  parseSectionsFromFile,
};
