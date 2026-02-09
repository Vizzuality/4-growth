import { mkdtemp, rm, mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

describe('Generic Wave OData Transformation', () => {
  let tmpDir: string;

  beforeAll(async () => {
    tmpDir = await mkdtemp(join(tmpdir(), 'wave-transform-test-'));
  });

  afterAll(async () => {
    await rm(tmpDir, { recursive: true, force: true });
  });

  describe('loadWaveEntities', () => {
    it('should load all required entity files from a wave directory', async () => {
      const { loadWaveEntities } = await import(
        '../../data/surveys/transform-wave'
      );

      const waveDir = join(tmpDir, 'load-test');
      await mkdir(waveDir, { recursive: true });

      await writeFile(
        join(waveDir, 'Root.json'),
        JSON.stringify([{ ID: 1, Identifier: 'SURVEY-001' }]),
      );
      await writeFile(
        join(waveDir, 'General_Information_4GROWTH.json'),
        JSON.stringify([
          { ID: 1, RootID: 1, variable: 'Location_CountryRegion' },
        ]),
      );
      await writeFile(
        join(waveDir, 'European_countries.json'),
        JSON.stringify([{ ID: 1, Description: 'Spain' }]),
      );

      const entities = await loadWaveEntities(waveDir);

      expect(entities.Root).toBeDefined();
      expect(entities.Root).toHaveLength(1);
      expect(entities.referenceLookup.get(1)).toBe('Spain');
    });

    it('should throw error if Root.json is missing', async () => {
      const { loadWaveEntities } = await import(
        '../../data/surveys/transform-wave'
      );

      const emptyDir = join(tmpDir, 'empty-wave');
      await mkdir(emptyDir, { recursive: true });

      await expect(loadWaveEntities(emptyDir)).rejects.toThrow(
        /Root\.json|required|not found/i,
      );
    });
  });

  describe('joinEntitiesByRootID', () => {
    it('should join entity records using RootID as foreign key', async () => {
      const { joinEntitiesByRootID } = await import(
        '../../data/surveys/transform-wave'
      );

      const rootRecords = [
        { ID: 1, Identifier: 'SURVEY-001' },
        { ID: 2, Identifier: 'SURVEY-002' },
      ];

      const childRecords = [
        { ID: 10, RootID: 1, variable: 'Question1', value: 'Answer1' },
        { ID: 11, RootID: 1, variable: 'Question2', value: 'Answer2' },
        { ID: 12, RootID: 2, variable: 'Question1', value: 'Answer3' },
      ];

      const joined = joinEntitiesByRootID(rootRecords, childRecords);

      expect(joined.get(1)).toHaveLength(2);
      expect(joined.get(2)).toHaveLength(1);
      expect(joined.get(1)?.[0].variable).toBe('Question1');
    });

    it('should handle records with no matching Root', async () => {
      const { joinEntitiesByRootID } = await import(
        '../../data/surveys/transform-wave'
      );

      const rootRecords = [{ ID: 1, Identifier: 'SURVEY-001' }];

      const childRecords = [
        { ID: 10, RootID: 999, variable: 'Orphan', value: 'Value' },
      ];

      const joined = joinEntitiesByRootID(rootRecords, childRecords);

      expect(joined.get(999)).toBeUndefined();
      expect(joined.get(1)).toEqual([]);
    });
  });

  describe('countryNameToISO3', () => {
    it('should convert country name to ISO3 code', async () => {
      const { countryNameToISO3 } = await import(
        '../../data/surveys/transform-wave'
      );

      expect(countryNameToISO3('Spain')).toBe('ESP');
      expect(countryNameToISO3('Germany')).toBe('DEU');
      expect(countryNameToISO3('France')).toBe('FRA');
      expect(countryNameToISO3('Netherlands')).toBe('NLD');
    });

    it('should return undefined for unknown countries', async () => {
      const { countryNameToISO3 } = await import(
        '../../data/surveys/transform-wave'
      );

      expect(countryNameToISO3('Unknown Country')).toBeUndefined();
      expect(countryNameToISO3('Mars')).toBeUndefined();
    });
  });

  describe('cleanAnswerText', () => {
    it('should remove language variants in parentheses from answers', async () => {
      const { cleanAnswerText } = await import(
        '../../data/surveys/transform-wave'
      );

      expect(cleanAnswerText('Yes (English)')).toBe('Yes');
      expect(cleanAnswerText('Agriculture (Spanish)')).toBe('Agriculture');
      expect(cleanAnswerText('No network (German lang)')).toBe('No network');
    });

    it('should preserve answers without language variants', async () => {
      const { cleanAnswerText } = await import(
        '../../data/surveys/transform-wave'
      );

      expect(cleanAnswerText('Yes')).toBe('Yes');
      expect(cleanAnswerText('Very reliable')).toBe('Very reliable');
    });

    it('should trim whitespace from answers', async () => {
      const { cleanAnswerText } = await import(
        '../../data/surveys/transform-wave'
      );

      expect(cleanAnswerText('  Yes  ')).toBe('Yes');
      expect(cleanAnswerText('\tNo\n')).toBe('No');
    });
  });

  describe('getSurveyId', () => {
    it('should use Root.Identifier as surveyId', async () => {
      const { getSurveyId } = await import(
        '../../data/surveys/transform-wave'
      );

      const rootRecord = { ID: 123, Identifier: 'UNIQUE-SURVEY-ID-456' };

      expect(getSurveyId(rootRecord)).toBe('UNIQUE-SURVEY-ID-456');
    });
  });

  describe('filterCategoricalAnswers', () => {
    it('should filter to only categorical_answer type records', async () => {
      const { filterCategoricalAnswers } = await import(
        '../../data/surveys/transform-wave'
      );

      const records = [
        { ID: 1, answer_type: 'categorical_answer', variable: 'Q1' },
        { ID: 2, answer_type: 'open_answer', variable: 'Q2' },
        { ID: 3, answer_type: 'categorical_answer', variable: 'Q3' },
        { ID: 4, answer_type: 'numeric', variable: 'Q4' },
      ];

      const filtered = filterCategoricalAnswers(records);

      expect(filtered).toHaveLength(2);
      expect(
        filtered.every((r) => r.answer_type === 'categorical_answer'),
      ).toBe(true);
    });
  });

  describe('filterValidAnswers', () => {
    it('should exclude records with empty descriptions', async () => {
      const { filterValidAnswers } = await import(
        '../../data/surveys/transform-wave'
      );

      const records = [
        { ID: 1, Description: 'Valid answer' },
        { ID: 2, Description: '' },
        { ID: 3, Description: '   ' },
        { ID: 4, Description: 'Another valid' },
      ];

      const filtered = filterValidAnswers(records);

      expect(filtered).toHaveLength(2);
      expect(filtered[0].Description).toBe('Valid answer');
    });
  });

  describe('transformWaveFromOData', () => {
    it('should produce correct SurveyAnswer format with parametrized wave number', async () => {
      const { transformWaveFromOData } = await import(
        '../../data/surveys/transform-wave'
      );

      const waveDir = join(tmpDir, 'wave-output-test');
      await mkdir(waveDir, { recursive: true });

      await writeFile(
        join(waveDir, 'Root.json'),
        JSON.stringify([{ ID: 1, Identifier: 'TEST-001' }]),
      );

      await writeFile(
        join(waveDir, 'General_Information_4GROWTH.json'),
        JSON.stringify([
          {
            ID: 10,
            RootID: 1,
            Location_CountryRegion: 5,
          },
        ]),
      );

      await writeFile(
        join(waveDir, 'European_countries.json'),
        JSON.stringify([{ ID: 5, Description: 'Spain' }]),
      );

      const variableMapping: Record<string, string> = {
        Location_CountryRegion: 'Location (country/region)',
      };

      const outputPath = join(tmpDir, 'surveys-wave-test.json');
      await transformWaveFromOData({
        waveNumber: 3,
        inputDir: waveDir,
        outputPath,
        variableMapping,
        hasQuestionMapping: (v: string) => v in variableMapping,
      });

      const outputContent = await readFile(outputPath, 'utf-8');
      const output = JSON.parse(outputContent);

      expect(Array.isArray(output)).toBe(true);

      if (output.length > 0) {
        const answer = output[0];
        expect(answer).toHaveProperty('surveyId');
        expect(answer).toHaveProperty('question');
        expect(answer).toHaveProperty('answer');
        expect(answer).toHaveProperty('countryCode');
        expect(answer).toHaveProperty('wave');
        expect(answer.wave).toBe(3);
      }
    });

    it('should use wave number 2 when configured for wave 2', async () => {
      const { transformWaveFromOData } = await import(
        '../../data/surveys/transform-wave'
      );

      const waveDir = join(tmpDir, 'wave2-number-test');
      await mkdir(waveDir, { recursive: true });

      await writeFile(
        join(waveDir, 'Root.json'),
        JSON.stringify([{ ID: 1, Identifier: 'W2-001' }]),
      );

      await writeFile(
        join(waveDir, 'General_Information_4GROWTH.json'),
        JSON.stringify([
          { ID: 10, RootID: 1, Location_CountryRegion: 1 },
        ]),
      );

      await writeFile(
        join(waveDir, 'European_countries.json'),
        JSON.stringify([{ ID: 1, Description: 'Germany' }]),
      );

      const variableMapping: Record<string, string> = {
        Location_CountryRegion: 'Location (country/region)',
      };

      const outputPath = join(tmpDir, 'surveys-wave2-number-test.json');
      await transformWaveFromOData({
        waveNumber: 2,
        inputDir: waveDir,
        outputPath,
        variableMapping,
        hasQuestionMapping: (v: string) => v in variableMapping,
      });

      const output = JSON.parse(await readFile(outputPath, 'utf-8'));

      for (const record of output) {
        expect(record.wave).toBe(2);
      }
    });
  });
});
