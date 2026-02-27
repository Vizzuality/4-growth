import { mkdtemp, rm, mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

describe('Wave 2 OData Transformation', () => {
  let tmpDir: string;

  beforeAll(async () => {
    tmpDir = await mkdtemp(join(tmpdir(), 'wave2-transform-test-'));
  });

  afterAll(async () => {
    await rm(tmpDir, { recursive: true, force: true });
  });

  describe('Loading Wave 2 JSON files', () => {
    it('should load all required entity files from wave2 directory', async () => {
      const { loadWave2Entities } =
        await import('../../data/surveys/transform-wave2');

      // Create mock entity files
      const wave2Dir = join(tmpDir, 'wave2');
      await mkdir(wave2Dir, { recursive: true });

      await writeFile(
        join(wave2Dir, 'Root.json'),
        JSON.stringify([{ ID: 1, Identifier: 'SURVEY-001' }]),
      );
      await writeFile(
        join(wave2Dir, 'General_Information_4GROWTH.json'),
        JSON.stringify([
          { ID: 1, RootID: 1, variable: 'Location_CountryRegion' },
        ]),
      );
      // Reference tables are loaded into referenceLookup, not as separate entities
      await writeFile(
        join(wave2Dir, 'European_countries.json'),
        JSON.stringify([{ ID: 1, Description: 'Spain' }]),
      );

      const entities = await loadWave2Entities(wave2Dir);

      expect(entities.Root).toBeDefined();
      expect(entities.Root).toHaveLength(1);
      expect(entities.referenceLookup.get(1)).toBe('Spain');
    });

    it('should throw error if Root.json is missing', async () => {
      const { loadWave2Entities } =
        await import('../../data/surveys/transform-wave2');

      const emptyDir = join(tmpDir, 'empty-wave2');
      await mkdir(emptyDir, { recursive: true });

      await expect(loadWave2Entities(emptyDir)).rejects.toThrow(
        /Root\.json|required|not found/i,
      );
    });
  });

  describe('Joining data using RootID', () => {
    it('should join entity records using RootID as foreign key', async () => {
      const { joinEntitiesByRootID } =
        await import('../../data/surveys/transform-wave2');

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
      const { joinEntitiesByRootID } =
        await import('../../data/surveys/transform-wave2');

      const rootRecords = [{ ID: 1, Identifier: 'SURVEY-001' }];

      const childRecords = [
        { ID: 10, RootID: 999, variable: 'Orphan', value: 'Value' },
      ];

      const joined = joinEntitiesByRootID(rootRecords, childRecords);

      expect(joined.get(999)).toBeUndefined();
      expect(joined.get(1)).toEqual([]);
    });
  });

  describe('Variable to question mapping', () => {
    it('should map OData variables to question text', async () => {
      const { WAVE2_VARIABLE_TO_QUESTION } =
        await import('../../data/surveys/wave2-variable-mapping');

      // Test shared questions (normalized to W1 text)
      expect(WAVE2_VARIABLE_TO_QUESTION['Location_CountryRegion']).toBe(
        'Location (country/region)',
      );
      expect(WAVE2_VARIABLE_TO_QUESTION['Type_of_stakeholder']).toBe(
        'Type of stakeholder',
      );

      // Test new W2 questions
      expect(
        WAVE2_VARIABLE_TO_QUESTION['What_type_of_organisation_are_you'],
      ).toBe('What type of organisation are you?');
    });

    it('should have mapping for core survey variables', async () => {
      const { WAVE2_VARIABLE_TO_QUESTION } =
        await import('../../data/surveys/wave2-variable-mapping');

      const coreVariables = [
        'Sector_AgriForestryBoth',
        'Type_of_stakeholder',
        'Location_CountryRegion',
        'Has_your_organisation_integrated_digital_technologies_into_its_workflows',
      ];

      for (const variable of coreVariables) {
        expect(WAVE2_VARIABLE_TO_QUESTION[variable]).toBeDefined();
      }
    });
  });

  describe('Country extraction and ISO3 conversion', () => {
    it('should extract country from Location_CountryRegion variable', async () => {
      const { extractCountryFromSurvey } =
        await import('../../data/surveys/transform-wave2');

      const surveyRecords = [
        {
          variable: 'Location_CountryRegion',
          categorical_answer_ID: 1,
        },
      ];

      const categoricalAnswers = [{ ID: 1, Description: 'Spain' }];

      const country = extractCountryFromSurvey(
        surveyRecords,
        categoricalAnswers,
      );

      expect(country).toBe('Spain');
    });

    it('should convert country name to ISO3 code', async () => {
      const { countryNameToISO3 } =
        await import('../../data/surveys/transform-wave2');

      expect(countryNameToISO3('Spain')).toBe('ESP');
      expect(countryNameToISO3('Germany')).toBe('DEU');
      expect(countryNameToISO3('France')).toBe('FRA');
      expect(countryNameToISO3('Netherlands')).toBe('NLD');
    });

    it('should return undefined for unknown countries', async () => {
      const { countryNameToISO3 } =
        await import('../../data/surveys/transform-wave2');

      expect(countryNameToISO3('Unknown Country')).toBeUndefined();
      expect(countryNameToISO3('Mars')).toBeUndefined();
    });
  });

  describe('Filtering categorical responses', () => {
    it('should filter to only categorical_answer type records', async () => {
      const { filterCategoricalAnswers } =
        await import('../../data/surveys/transform-wave2');

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

    it('should exclude records with empty descriptions', async () => {
      const { filterValidAnswers } =
        await import('../../data/surveys/transform-wave2');

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

  describe('Answer text cleaning', () => {
    it('should remove language variants in parentheses from answers', async () => {
      const { cleanAnswerText } =
        await import('../../data/surveys/transform-wave2');

      expect(cleanAnswerText('Yes (English)')).toBe('Yes');
      expect(cleanAnswerText('Agriculture (Spanish)')).toBe('Agriculture');
      expect(cleanAnswerText('No network (German lang)')).toBe('No network');
    });

    it('should preserve answers without language variants', async () => {
      const { cleanAnswerText } =
        await import('../../data/surveys/transform-wave2');

      expect(cleanAnswerText('Yes')).toBe('Yes');
      expect(cleanAnswerText('Very reliable')).toBe('Very reliable');
    });

    it('should trim whitespace from answers', async () => {
      const { cleanAnswerText } =
        await import('../../data/surveys/transform-wave2');

      expect(cleanAnswerText('  Yes  ')).toBe('Yes');
      expect(cleanAnswerText('\tNo\n')).toBe('No');
    });
  });

  describe('Output format', () => {
    it('should produce correct SurveyAnswer format', async () => {
      const { transformWave2FromOData } =
        await import('../../data/surveys/transform-wave2');

      // Create mock OData files
      const wave2Dir = join(tmpDir, 'wave2-output-test');
      await mkdir(wave2Dir, { recursive: true });

      // Root entity
      await writeFile(
        join(wave2Dir, 'Root.json'),
        JSON.stringify([{ ID: 1, Identifier: 'TEST-001' }]),
      );

      // General_Information_4GROWTH with country and sector
      await writeFile(
        join(wave2Dir, 'General_Information_4GROWTH.json'),
        JSON.stringify([
          {
            ID: 10,
            RootID: 1,
            Location_CountryRegion: 5,
          },
        ]),
      );

      // Adoption_of_Digital_Technologies with a question
      await writeFile(
        join(wave2Dir, 'Adoption_of_Digital_Technologies.json'),
        JSON.stringify([
          {
            ID: 20,
            RootID: 1,
            Has_your_organisation_integrated_digital_technologies_into_its_workflows: 10,
          },
        ]),
      );

      // Categorical answers lookup
      await writeFile(
        join(wave2Dir, 'Categorical_Answers.json'),
        JSON.stringify([
          { ID: 5, Description: 'Spain' },
          { ID: 10, Description: 'Yes (English)' },
        ]),
      );

      // Other required files (can be empty arrays)
      await writeFile(
        join(wave2Dir, 'Data_Management.json'),
        JSON.stringify([]),
      );
      await writeFile(
        join(wave2Dir, 'Technology_Performance.json'),
        JSON.stringify([]),
      );
      await writeFile(
        join(wave2Dir, 'Associated_costs_and_prerequisites.json'),
        JSON.stringify([]),
      );

      const outputPath = join(tmpDir, 'surveys-wave2-test.json');
      await transformWave2FromOData(wave2Dir, outputPath);

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
        expect(answer.wave).toBe(2);
      }
    });

    it('should include wave: 2 in all output records', async () => {
      const { transformWave2FromOData } =
        await import('../../data/surveys/transform-wave2');

      // Create minimal mock data
      const wave2Dir = join(tmpDir, 'wave2-wave-test');
      await mkdir(wave2Dir, { recursive: true });

      await writeFile(
        join(wave2Dir, 'Root.json'),
        JSON.stringify([
          { ID: 1, Identifier: 'W2-001' },
          { ID: 2, Identifier: 'W2-002' },
        ]),
      );

      await writeFile(
        join(wave2Dir, 'General_Information_4GROWTH.json'),
        JSON.stringify([
          { ID: 10, RootID: 1, Location_CountryRegion: 1 },
          { ID: 11, RootID: 2, Location_CountryRegion: 1 },
        ]),
      );

      await writeFile(
        join(wave2Dir, 'Categorical_Answers.json'),
        JSON.stringify([{ ID: 1, Description: 'Germany' }]),
      );

      // Empty arrays for other entities
      for (const entity of [
        'Adoption_of_Digital_Technologies',
        'Data_Management',
        'Technology_Performance',
        'Associated_costs_and_prerequisites',
      ]) {
        await writeFile(join(wave2Dir, `${entity}.json`), JSON.stringify([]));
      }

      const outputPath = join(tmpDir, 'surveys-wave2-wave-test.json');
      await transformWave2FromOData(wave2Dir, outputPath);

      const output = JSON.parse(await readFile(outputPath, 'utf-8'));

      for (const record of output) {
        expect(record.wave).toBe(2);
      }
    });
  });

  describe('Survey ID extraction', () => {
    it('should use Root.Identifier as surveyId', async () => {
      const { getSurveyId } =
        await import('../../data/surveys/transform-wave2');

      const rootRecord = { ID: 123, Identifier: 'UNIQUE-SURVEY-ID-456' };

      expect(getSurveyId(rootRecord)).toBe('UNIQUE-SURVEY-ID-456');
    });
  });
});
