/**
 * Integration tests for the Wave 1+3 → Wave 2 harmonization of
 * "What percentage of your products or services are specifically targeted
 * at the agricultural and forestry sectors?"
 *
 * Four layers are covered:
 *  1. WAVE1_ANSWER_NORMALIZATIONS — correct mapping entries exist
 *  2. WAVE2_EXCLUDED_QUESTIONS   — question is no longer excluded from Wave 2
 *  3. WAVE2_ANSWER_NORMALIZATIONS — Wave 2 bracket values pass through unchanged
 *  4. transform() pipeline        — normalization is applied end-to-end
 */

import { mkdtemp, rm, mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const QUESTION =
  'What percentage of your products or services are specifically targeted at the agricultural and forestry sectors?';

// ── Layer 1: WAVE1_ANSWER_NORMALIZATIONS ──────────────────────────────────────

describe('WAVE1_ANSWER_NORMALIZATIONS — agri/forestry percentage mapping', () => {
  it('has an entry for the agri/forestry percentage question', async () => {
    const { WAVE1_ANSWER_NORMALIZATIONS } = await import(
      '../../data/surveys/transform'
    );
    expect(WAVE1_ANSWER_NORMALIZATIONS.has(QUESTION)).toBe(true);
  });

  it('maps 90% to >90%', async () => {
    const { WAVE1_ANSWER_NORMALIZATIONS } = await import(
      '../../data/surveys/transform'
    );
    expect(WAVE1_ANSWER_NORMALIZATIONS.get(QUESTION)?.get('90%')).toBe('>90%');
  });

  it('maps 75% to <75%', async () => {
    const { WAVE1_ANSWER_NORMALIZATIONS } = await import(
      '../../data/surveys/transform'
    );
    expect(WAVE1_ANSWER_NORMALIZATIONS.get(QUESTION)?.get('75%')).toBe('<75%');
  });

  it('maps 25% to <25%', async () => {
    const { WAVE1_ANSWER_NORMALIZATIONS } = await import(
      '../../data/surveys/transform'
    );
    expect(WAVE1_ANSWER_NORMALIZATIONS.get(QUESTION)?.get('25%')).toBe('<25%');
  });

  it('does not map N/A — it should pass through unchanged', async () => {
    const { WAVE1_ANSWER_NORMALIZATIONS } = await import(
      '../../data/surveys/transform'
    );
    expect(WAVE1_ANSWER_NORMALIZATIONS.get(QUESTION)?.has('N/A')).toBe(false);
  });

  it('does not map Wave 2 bracket values — they never appear in Wave 1+3 raw data', async () => {
    const { WAVE1_ANSWER_NORMALIZATIONS } = await import(
      '../../data/surveys/transform'
    );
    const map = WAVE1_ANSWER_NORMALIZATIONS.get(QUESTION)!;
    for (const bracket of ['>90%', '<75%', '<50%', '<25%']) {
      expect(map.has(bracket)).toBe(false);
    }
  });

  it('maps exactly three Wave 1+3 values (90%, 75%, 25%) and nothing else', async () => {
    const { WAVE1_ANSWER_NORMALIZATIONS } = await import(
      '../../data/surveys/transform'
    );
    const map = WAVE1_ANSWER_NORMALIZATIONS.get(QUESTION)!;
    expect(map.size).toBe(3);
    expect([...map.keys()].sort()).toEqual(['25%', '75%', '90%']);
  });
});

// ── Layer 2: WAVE2_EXCLUDED_QUESTIONS ─────────────────────────────────────────

describe('WAVE2_EXCLUDED_QUESTIONS — agri/forestry question is no longer excluded', () => {
  it('does not exclude the agri/forestry percentage question', async () => {
    const { WAVE2_EXCLUDED_QUESTIONS } = await import(
      '../../data/surveys/transform-wave2'
    );
    expect(WAVE2_EXCLUDED_QUESTIONS.has(QUESTION)).toBe(false);
  });

  it('is empty — no Wave 2 questions are currently excluded', async () => {
    const { WAVE2_EXCLUDED_QUESTIONS } = await import(
      '../../data/surveys/transform-wave2'
    );
    expect(WAVE2_EXCLUDED_QUESTIONS.size).toBe(0);
  });
});

// ── Layer 3: WAVE2_ANSWER_NORMALIZATIONS ──────────────────────────────────────

describe('WAVE2_ANSWER_NORMALIZATIONS — Wave 2 bracket values pass through unchanged', () => {
  it('has no entry for the agri/forestry question', async () => {
    const { WAVE2_ANSWER_NORMALIZATIONS } = await import(
      '../../data/surveys/transform-wave2'
    );
    expect(WAVE2_ANSWER_NORMALIZATIONS.has(QUESTION)).toBe(false);
  });
});

// ── Layer 4: transform() pipeline ─────────────────────────────────────────────

describe('transform() pipeline — normalization applied end-to-end', () => {
  let tmpDir: string;

  beforeAll(async () => {
    tmpDir = await mkdtemp(join(tmpdir(), 'agri-harmonization-test-'));
  });

  afterAll(async () => {
    await rm(tmpDir, { recursive: true, force: true });
  });

  /**
   * Build minimal OData Wave 1/3 JSON files that produce a single survey
   * with one agri/forestry percentage answer and one location answer
   * (location is required for the transform country-resolution step).
   *
   * OData model for Wave 1/3:
   *   Answer.json              { Survey_per_dayID, ID, Categorical_Answer (answerID), Subquestion (questionID) }
   *   Survey_metadata.json     { Survey_per_dayID, ID (surveyId), Name, Survey_language }
   *   Question_hierarchy.json  { Level1, Level2 (question text), Level3, Level4, ID (questionID) }
   *   Categorical_Answers.json { Name, Description (answer text), ExternalID, ID (answerID) }
   */
  async function buildMockDir(dirName: string, rawAnswer: string): Promise<string> {
    const dir = join(tmpDir, dirName);
    await mkdir(dir, { recursive: true });

    const SURVEY_PER_DAY_ID = 1;
    const Q_AGRI_ID = 9001;
    const A_PERCENTAGE_ID = 9002;
    const Q_LOCATION_ID = 9003;
    const A_SPAIN_ID = 9004;

    await writeFile(
      join(dir, 'Survey_metadata.json'),
      JSON.stringify([
        {
          CalendarID: 1,
          Survey_per_dayID: SURVEY_PER_DAY_ID,
          ID: 'SURVEY-HARMON-001',
          Finished: 'True',
          Name: 'Test-org',          // anything other than 'VTT' passes the non-vtt filter
          Survey_language: 'EN',
          Duration: 30,
          Survey_record_ID: 'abc123',
        },
      ]),
    );

    await writeFile(
      join(dir, 'Answer.json'),
      JSON.stringify([
        // Agri/forestry percentage answer
        {
          CalendarID: 1,
          Survey_per_dayID: SURVEY_PER_DAY_ID,
          ID: 'ANS-AGRI-001',
          Categorical_Answer: A_PERCENTAGE_ID,
          Subquestion: Q_AGRI_ID,
        },
        // Location answer — required for country-code resolution
        {
          CalendarID: 1,
          Survey_per_dayID: SURVEY_PER_DAY_ID,
          ID: 'ANS-LOC-001',
          Categorical_Answer: A_SPAIN_ID,
          Subquestion: Q_LOCATION_ID,
        },
      ]),
    );

    await writeFile(
      join(dir, 'Question_hierarchy.json'),
      JSON.stringify([
        {
          Level1: 'Sales and services',
          Level2: QUESTION,
          Level3: QUESTION,
          Level4: QUESTION,
          ID: Q_AGRI_ID,
        },
        {
          Level1: 'General information',
          Level2: 'Location (country/region)',
          Level3: 'Location (country/region)',
          Level4: 'Location (country/region)',
          ID: Q_LOCATION_ID,
        },
      ]),
    );

    await writeFile(
      join(dir, 'Categorical_Answers.json'),
      JSON.stringify([
        // The raw percentage answer for the agri/forestry question
        {
          Name: rawAnswer,
          Description: rawAnswer,
          ExternalID: rawAnswer,
          ID: A_PERCENTAGE_ID,
        },
        // Spain — getISO3ByCountryName('Spain') === 'ESP'
        {
          Name: 'Spain',
          Description: 'Spain',
          ExternalID: 'ESP',
          ID: A_SPAIN_ID,
        },
      ]),
    );

    return dir;
  }

  const cases: [string, string][] = [
    ['90%', '>90%'],
    ['75%', '<75%'],
    ['25%', '<25%'],
  ];

  for (const [raw, expected] of cases) {
    it(`normalizes Wave 1+3 answer "${raw}" → "${expected}" in ETL JSON output`, async () => {
      const { transform } = await import('../../data/surveys/transform');

      const dir = await buildMockDir(`pipeline-${raw.replace('%', 'pct')}`, raw);
      const outputPath = join(tmpDir, `output-${raw.replace('%', 'pct')}.json`);

      await transform(dir, outputPath);

      const records: { question: string; answer: string }[] = JSON.parse(
        await readFile(outputPath, 'utf-8'),
      );

      const record = records.find((r) => r.question === QUESTION);
      expect(record).toBeDefined();
      expect(record!.answer).toBe(expected);
    });
  }

  it('leaves an unmapped Wave 1+3 answer (N/A) unchanged in ETL output', async () => {
    const { transform } = await import('../../data/surveys/transform');

    const dir = await buildMockDir('pipeline-na', 'N/A');
    const outputPath = join(tmpDir, 'output-na.json');

    await transform(dir, outputPath);

    const records: { question: string; answer: string }[] = JSON.parse(
      await readFile(outputPath, 'utf-8'),
    );

    const record = records.find((r) => r.question === QUESTION);
    expect(record).toBeDefined();
    expect(record!.answer).toBe('N/A');
  });
});
