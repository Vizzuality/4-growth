import {
  PROJECTION_TYPES,
  ProjectionType,
} from '@shared/dto/projections/projection-types';
import { Projection } from '@shared/dto/projections/projection.entity';
import { CountryISOMap } from '@shared/constants/country-iso.map';
import * as fs from 'fs';
import { ProjectionData } from '@shared/dto/projections/projection-data.entity';
import { ProjectionScenarios } from '@shared/dto/projections/projection-types';
import { parse } from 'csv-parse/sync';

// Helper function to find section boundaries dynamically
const findSectionBoundaries = (lines: string[][]) => {
  const sections = [];

  // Define section patterns and their corresponding projection types
  const sectionPatterns = [
    {
      pattern: /A\.\s*Market potential/,
      type: PROJECTION_TYPES.MARKET_POTENTIAL,
    },
    {
      pattern: /B\.\s*Addressable market/,
      type: PROJECTION_TYPES.ADDRESSABLE_MARKET,
    },
    { pattern: /C\.\s*Penetration/, type: PROJECTION_TYPES.PENETRATION },
    { pattern: /D\.\s*Shipments/, type: PROJECTION_TYPES.SHIPMENTS },
    {
      pattern: /E\.\s*Installed base/,
      type: PROJECTION_TYPES.INSTALLED_BASE,
    },
    { pattern: /F\.\s*Prices/, type: PROJECTION_TYPES.PRICES },
    { pattern: /G\.\s*Revenues/, type: PROJECTION_TYPES.REVENUES },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if any cell in this line matches any section pattern
    const matchedSection = sectionPatterns.find((section) =>
      line.some((cell) => section.pattern.test(cell)),
    );

    if (matchedSection) {
      // Find the start of data (skip header rows after section title)
      let dataStartIdx = i + 1;
      while (
        dataStartIdx < lines.length &&
        (lines[dataStartIdx].length === 0 ||
          lines[dataStartIdx].some((cell) => cell.includes('Tech #')) ||
          lines[dataStartIdx].every((cell) => cell.trim() === ''))
      ) {
        dataStartIdx++;
      }

      sections.push({
        type: matchedSection.type,
        startIdx: dataStartIdx,
        headerIdx: i,
      });
    }
  }

  // Set end indices for each section
  for (let i = 0; i < sections.length; i++) {
    if (i < sections.length - 1) {
      sections[i].endIdx = sections[i + 1].headerIdx - 1;
    } else {
      // For the last section, find the END marker or use end of file
      let endIdx = lines.length;
      for (let j = sections[i].startIdx; j < lines.length; j++) {
        if (lines[j].some((cell) => cell.includes('END'))) {
          endIdx = j;
          break;
        }
      }
      sections[i].endIdx = endIdx;
    }
  }

  return sections;
};

const parseCategory = (
  lines: string[][],
  fromIdx: number,
  toIdx: number,
  type: ProjectionType,
  scenario: ProjectionScenarios,
  category: string,
  startId: number,
) => {
  const result: Projection[] = [];
  let currentId = startId;

  for (let idx = fromIdx; idx < toIdx; idx++) {
    const element = lines[idx];

    // Skip empty lines or lines that don't have enough data
    if (!element || element.length < 12 || !element[10]) continue;

    const country = CountryISOMap.getISO3ByCountryName(element[10].trim());
    if (!country) continue;

    const id = currentId++;
    const projectionData: ProjectionData[] = [];
    for (let i = 12; i < 33; i++) {
      const year = 2008 + i;
      // Remove quotes and commas, then parse as float
      const cleanValue = element[i].replace(/[",]/g, '');
      const value: any = Number.parseFloat(cleanValue);
      projectionData.push({
        projection: { id } as Projection,
        year,
        value,
      });
    }

    result.push({
      id,
      category,
      type,
      scenario,
      technology: element[3].trim(),
      subsegment: element[5].trim(),
      application: element[7].trim(),
      technologyType: element[8].trim(),
      region: element[9].trim(),
      unit: element[11].trim(),
      country: CountryISOMap.getISO3ByCountryName(element[10].trim()),
      projectionData,
    });
  }
  return { projections: result, nextId: currentId };
};

const parseFromFile = async (
  filePath: string,
  opts: { category?: string; scenario?: string; startId?: number } = {},
) => {
  const { category, scenario, startId = 1 } = opts;

  const fileContent = await fs.promises.readFile(filePath, 'utf-8');
  const lines = parse(fileContent, {
    skip_empty_lines: true,
    relaxQuotes: true,
  });

  // Find section boundaries dynamically
  const sections = findSectionBoundaries(lines);

  const result: Projection[] = [];
  let currentId = startId;

  // Parse each section
  for (const section of sections) {
    const { projections, nextId } = parseCategory(
      lines,
      section.startIdx,
      section.endIdx,
      section.type,
      scenario,
      category,
      currentId,
    );
    result.push(...projections);
    currentId = nextId;
  }

  return { projections: result, nextId: currentId };
};

export const ProjectionsParser = {
  parseFromFile,
};
