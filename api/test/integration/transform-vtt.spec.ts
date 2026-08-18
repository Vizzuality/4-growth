import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('VTT transform filterMode', () => {
  let tmpDir: string;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vtt-transform-'));

    // Survey_metadata: one VTT entry, one non-VTT entry, sharing the same Survey_per_dayID range
    fs.writeFileSync(
      path.join(tmpDir, 'Survey_metadata.json'),
      JSON.stringify([
        {
          Survey_per_dayID: 1001,
          ID: 'VTT-SURVEY-1',
          Name: 'VTT',
          Survey_language: 'EN',
        },
        {
          Survey_per_dayID: 1002,
          ID: 'WAVE1-SURVEY-1',
          Name: 'Wave1',
          Survey_language: 'EN',
        },
      ]),
    );

    // Answer: one answer per survey, both answer the "Location" question
    fs.writeFileSync(
      path.join(tmpDir, 'Answer.json'),
      JSON.stringify([
        {
          Survey_per_dayID: 1001,
          ID: 'ANS-VTT-1',
          Subquestion: 9001,
          Categorical_Answer: 8001,
        },
        {
          Survey_per_dayID: 1002,
          ID: 'ANS-WAVE1-1',
          Subquestion: 9001,
          Categorical_Answer: 8001,
        },
      ]),
    );

    // Question_hierarchy: question 9001 is "Location (country/region)"
    fs.writeFileSync(
      path.join(tmpDir, 'Question_hierarchy.json'),
      JSON.stringify([{ ID: 9001, Level2: 'Location (country/region)' }]),
    );

    // Categorical_Answers: answer 8001 maps to "Finland"
    fs.writeFileSync(
      path.join(tmpDir, 'Categorical_Answers.json'),
      JSON.stringify([{ ID: 8001, Description: 'Finland' }]),
    );
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('vtt-only mode includes only surveys with Name === VTT', async () => {
    const { transform } = await import('../../data/surveys/transform');
    const outPath = path.join(tmpDir, 'out-vtt-only.json');

    await transform(
      tmpDir,
      outPath,
      'level2',
      new Map(),
      new Map(),
      new Set(),
      'vtt-only',
    );

    const output: Array<{ surveyId: string }> = JSON.parse(
      fs.readFileSync(outPath, 'utf-8'),
    );
    const surveyIds = [...new Set(output.map((r) => r.surveyId))];

    expect(surveyIds).toContain('VTT-SURVEY-1');
    expect(surveyIds).not.toContain('WAVE1-SURVEY-1');
  });

  it('non-vtt mode (default) excludes surveys with Name === VTT', async () => {
    const { transform } = await import('../../data/surveys/transform');
    const outPath = path.join(tmpDir, 'out-non-vtt.json');

    await transform(
      tmpDir,
      outPath,
      'level2',
      new Map(),
      new Map(),
      new Set(),
      'non-vtt',
    );

    const output: Array<{ surveyId: string }> = JSON.parse(
      fs.readFileSync(outPath, 'utf-8'),
    );
    const surveyIds = [...new Set(output.map((r) => r.surveyId))];

    expect(surveyIds).toContain('WAVE1-SURVEY-1');
    expect(surveyIds).not.toContain('VTT-SURVEY-1');
  });

  it('vtt-only and non-vtt modes partition all surveys with no overlap', async () => {
    const { transform } = await import('../../data/surveys/transform');
    const vttOut = path.join(tmpDir, 'out-vtt-partition.json');
    const nonVttOut = path.join(tmpDir, 'out-non-vtt-partition.json');

    await Promise.all([
      transform(tmpDir, vttOut, 'level2', new Map(), new Map(), new Set(), 'vtt-only'),
      transform(tmpDir, nonVttOut, 'level2', new Map(), new Map(), new Set(), 'non-vtt'),
    ]);

    const vttIds = new Set<string>(
      JSON.parse(fs.readFileSync(vttOut, 'utf-8')).map(
        (r: { surveyId: string }) => r.surveyId,
      ),
    );
    const nonVttIds = new Set<string>(
      JSON.parse(fs.readFileSync(nonVttOut, 'utf-8')).map(
        (r: { surveyId: string }) => r.surveyId,
      ),
    );

    for (const id of vttIds) {
      expect(nonVttIds.has(id)).toBe(false);
    }
    expect(vttIds.size + nonVttIds.size).toBe(2);
  });
});
