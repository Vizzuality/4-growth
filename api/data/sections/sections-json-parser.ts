import { Section } from '@shared/dto/sections/section.entity';
import * as fs from 'fs';

const ensureWidgetsAreUnique = (sections: Section[]) => {
  const sectionSlugSet = new Set();
  const widgetIndicatorSet = new Set();

  for (const section of sections) {
    if (widgetIndicatorSet.has(section.slug)) {
      throw new Error(`Duplicate section slug found: ${section.slug}`);
    }
    sectionSlugSet.add(section.slug);
    for (const widget of section.baseWidgets) {
      if (widgetIndicatorSet.has(widget.indicator)) {
        throw new Error(
          `Duplicate widget indicator found: ${widget.indicator}`,
        );
      }
      widgetIndicatorSet.add(widget.indicator);
    }
  }
};

const parseSectionsFromFile = async (filePath: string): Promise<Section[]> => {
  const sections = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
  ensureWidgetsAreUnique(sections);
  return sections;
};

export const SectionsJSONParser = {
  parseSectionsFromFile,
};
