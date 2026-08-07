import { mkdtemp, rm, mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { wrangleWave2 } from '../../data/surveys/wrangle-wave2';

describe('Wave 2 Wrangle', () => {
  let tmpDir: string;
  let inputDir: string;
  let outputDir: string;

  beforeEach(async () => {
    tmpDir = await mkdtemp(join(tmpdir(), 'wave2-wrangle-test-'));
    inputDir = join(tmpDir, 'input');
    outputDir = join(tmpDir, 'output');
    await mkdir(inputDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true });
  });

  const writeFixtureFile = (name: string, data: object[]) =>
    writeFile(join(inputDir, `${name}.json`), JSON.stringify(data));

  // Read output file and unwrap OData envelope
  const readOutput = async (filename: string): Promise<any[]> => {
    const raw = JSON.parse(await readFile(join(outputDir, filename), 'utf-8'));
    return raw.value;
  };

  const writeMinimalFixture = async () => {
    await writeFixtureFile('General_Information_4GROWTH', [
      {
        ID: 'SURVEY-001',
        CalendarID: 37706,
        RootID: 100,
        Sector: 1001,
        Type_of_stakeholder: 1002,
      },
    ]);
    await writeFixtureFile('Sector_', [
      { ID: 1001, Name: 'Agriculture', Description: 'Agriculture' },
    ]);
    await writeFixtureFile('Type_of_stakeholder', [
      { ID: 1002, Name: 'Farmer', Description: 'Farmer' },
    ]);
  };

  describe('output file structure', () => {
    it('produces all 4 output JSON files in OData envelope format', async () => {
      await writeMinimalFixture();
      await wrangleWave2(inputDir, outputDir);

      for (const file of ['Answer.json', 'Survey_metadata.json', 'Question_hierarchy.json', 'Categorical_Answers.json']) {
        const raw = JSON.parse(await readFile(join(outputDir, file), 'utf-8'));
        expect(raw).toHaveProperty(['@odata.context']);
        expect(raw).toHaveProperty('value');
        expect(Array.isArray(raw.value)).toBe(true);
      }
    });

    it('Answer.json records have all fields required by transform.ts', async () => {
      await writeMinimalFixture();
      await wrangleWave2(inputDir, outputDir);

      const answers = await readOutput('Answer.json');
      expect(answers.length).toBeGreaterThan(0);
      for (const answer of answers) {
        expect(answer).toHaveProperty('CalendarID');
        expect(answer).toHaveProperty('Survey_per_dayID');
        expect(answer).toHaveProperty('ID');
        expect(answer).toHaveProperty('Subquestion');
        expect(answer).toHaveProperty('Categorical_Answer');
      }
    });

    it('Survey_metadata.json records have all fields required by transform.ts', async () => {
      await writeMinimalFixture();
      await wrangleWave2(inputDir, outputDir);

      const meta = await readOutput('Survey_metadata.json');
      expect(meta.length).toBeGreaterThan(0);
      for (const survey of meta) {
        expect(survey).toHaveProperty('Survey_per_dayID');
        expect(survey).toHaveProperty('ID');
        expect(survey).toHaveProperty('Survey_language');
        expect(survey).toHaveProperty('CalendarID');
      }
    });

    it('Question_hierarchy.json records have Level1, Level2, Level3 and ID', async () => {
      await writeMinimalFixture();
      await wrangleWave2(inputDir, outputDir);

      const questions = await readOutput('Question_hierarchy.json');
      expect(questions.length).toBeGreaterThan(0);
      for (const q of questions) {
        expect(q).toHaveProperty('Level1');
        expect(q).toHaveProperty('Level2');
        expect(q).toHaveProperty('Level3');
        expect(q).toHaveProperty('ID');
        expect(typeof q.Level3).toBe('string');
      }
    });
  });

  describe('CF* PII filter', () => {
    it('excludes CF* columns from Answer.json and Question_hierarchy.json', async () => {
      await writeFixtureFile('General_Information_4GROWTH', [
        {
          ID: 'SURVEY-001',
          CalendarID: 37706,
          RootID: 100,
          Sector: 1001,
          CFName: 'John Doe',
          CFContactYes: 'john@example.com',
          CFConfirm: 'I agree',
          CFContact: 1,
        },
      ]);
      await writeFixtureFile('Sector_', [
        { ID: 1001, Name: 'Agriculture', Description: 'Agriculture' },
      ]);

      await wrangleWave2(inputDir, outputDir);

      const questions = await readOutput('Question_hierarchy.json');
      const level2Texts = questions.map((q: any) => q.Level2 as string);
      expect(level2Texts.some((t) => t.startsWith('CF'))).toBe(false);

      // Only Sector should be present — not any CF* column
      expect(level2Texts).toContain('Sector');
      expect(level2Texts).toHaveLength(1);
    });
  });

  describe('open-answer placeholder', () => {
    it('Categorical_Answers.json contains ID=-1 with "No categorical answer"', async () => {
      await writeMinimalFixture();
      await wrangleWave2(inputDir, outputDir);

      const catAnswers = await readOutput('Categorical_Answers.json');
      const placeholder = catAnswers.find((r: any) => r.ID === -1);
      expect(placeholder).toBeDefined();
      expect(placeholder.Name).toBe('No categorical answer');
      expect(placeholder.Description).toBe('No categorical answer');
    });

    it('open-answer string values produce Categorical_Answer=-1 rows', async () => {
      await writeFixtureFile('Additional_comments_4GROWTH', [
        {
          ID: 'SURVEY-001',
          CalendarID: 37706,
          RootID: 100,
          Comment: 'Some free text comment',
        },
      ]);

      await wrangleWave2(inputDir, outputDir);

      const answers = await readOutput('Answer.json');
      const openAnswer = answers.find((a: any) => a.Categorical_Answer === -1);
      expect(openAnswer).toBeDefined();
      expect(openAnswer.Open_ended_answer).toBe('Some free text comment');
    });
  });

  describe('survey metadata', () => {
    it('produces one Survey_metadata entry per unique RootID', async () => {
      await writeFixtureFile('General_Information_4GROWTH', [
        { ID: 'SURVEY-001', CalendarID: 37706, RootID: 100, Sector: 1001 },
        { ID: 'SURVEY-002', CalendarID: 37706, RootID: 200, Sector: 1001 },
      ]);
      await writeFixtureFile('Adoption_of_Digital_Technologies_and_Technology_Integration_4GROWTH', [
        { ID: 'SURVEY-001', CalendarID: 37706, RootID: 100, Sector: 1001 }, // same RootID as above
      ]);
      await writeFixtureFile('Sector_', [
        { ID: 1001, Name: 'Agriculture', Description: 'Agriculture' },
      ]);

      await wrangleWave2(inputDir, outputDir);

      const meta = await readOutput('Survey_metadata.json');
      expect(meta).toHaveLength(2);
      const rootIds = meta.map((m: any) => m.Survey_per_dayID);
      expect(rootIds).toContain(100);
      expect(rootIds).toContain(200);
    });

    it('defaults Survey_language to EN for RootIDs not in LANG_MAP', async () => {
      await writeMinimalFixture(); // RootID=100 is not in any LANG_MAP group
      await wrangleWave2(inputDir, outputDir);

      const meta = await readOutput('Survey_metadata.json');
      expect(meta[0].Survey_language).toBe('EN');
    });

    it('assigns correct language for RootIDs present in LANG_MAP', async () => {
      // RootID 43 is in the FI (Finnish) group in LANG_MAP
      await writeFixtureFile('General_Information_4GROWTH', [
        { ID: 'SURVEY-FI', CalendarID: 37706, RootID: 43, Sector: 1001 },
      ]);
      await writeFixtureFile('Sector_', [
        { ID: 1001, Name: 'Agriculture', Description: 'Agriculture' },
      ]);

      await wrangleWave2(inputDir, outputDir);

      const meta = await readOutput('Survey_metadata.json');
      expect(meta[0].Survey_language).toBe('FI');
    });
  });

  describe('deduplication', () => {
    it('deduplicates rows with the same (rootId, variable, value) across fact entities', async () => {
      // Same Sector answer for RootID=100 appears in two different fact entities
      await writeFixtureFile('General_Information_4GROWTH', [
        { ID: 'SURVEY-001', CalendarID: 37706, RootID: 100, Sector: 1001 },
      ]);
      await writeFixtureFile('Adoption_of_Digital_Technologies_and_Technology_Integration_4GROWTH', [
        { ID: 'SURVEY-001', CalendarID: 37706, RootID: 100, Sector: 1001 },
      ]);
      await writeFixtureFile('Sector_', [
        { ID: 1001, Name: 'Agriculture', Description: 'Agriculture' },
      ]);

      await wrangleWave2(inputDir, outputDir);

      const answers = await readOutput('Answer.json');
      const sectorAnswers = answers.filter((a: any) => a.Categorical_Answer === 1001);
      expect(sectorAnswers).toHaveLength(1);
    });
  });

  describe('missing fact files', () => {
    it('skips missing fact entity files and completes without error', async () => {
      // Only one of the 12 fact entities is provided
      await writeFixtureFile('General_Information_4GROWTH', [
        { ID: 'SURVEY-001', CalendarID: 37706, RootID: 100, Sector: 1001 },
      ]);
      await writeFixtureFile('Sector_', [
        { ID: 1001, Name: 'Agriculture', Description: 'Agriculture' },
      ]);

      await expect(wrangleWave2(inputDir, outputDir)).resolves.not.toThrow();

      const answers = await readOutput('Answer.json');
      expect(answers.length).toBeGreaterThan(0);
    });
  });

  describe('question hierarchy', () => {
    it('assigns stable numeric IDs starting at 1000', async () => {
      await writeMinimalFixture();
      await wrangleWave2(inputDir, outputDir);

      const questions = await readOutput('Question_hierarchy.json');
      const ids = questions.map((q: any) => q.ID as number);
      expect(Math.min(...ids)).toBe(1000);
      expect(ids.every((id) => id >= 1000)).toBe(true);
    });

    it('each unique variable gets a unique question ID', async () => {
      await writeMinimalFixture(); // Sector + Type_of_stakeholder = 2 variables
      await wrangleWave2(inputDir, outputDir);

      const questions = await readOutput('Question_hierarchy.json');
      const ids = questions.map((q: any) => q.ID as number);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('Answer.json Subquestion IDs match Question_hierarchy IDs', async () => {
      await writeMinimalFixture();
      await wrangleWave2(inputDir, outputDir);

      const questions = await readOutput('Question_hierarchy.json');
      const answers = await readOutput('Answer.json');
      const questionIds = new Set(questions.map((q: any) => q.ID));

      for (const answer of answers) {
        expect(questionIds.has(answer.Subquestion)).toBe(true);
      }
    });
  });
});
