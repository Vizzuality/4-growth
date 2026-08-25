import * as fs from 'fs';
import * as path from 'path';
import { runTransform } from './transform';
import { ProjectionsParser } from 'api/data/projections/projections.parser';
import { PROJECTION_TYPES } from '@shared/dto/projections/projection-types';

const CSV_DIR = path.join(__dirname);
const OUT_PATH = path.join(__dirname, 'projections.json');

describe('runTransform', () => {
  let writeSpy: jest.SpyInstance;

  beforeEach(() => {
    writeSpy = jest
      .spyOn(fs.promises, 'writeFile')
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it(
    'succeeds with committed CSVs and writes compact JSON',
    async () => {
      await runTransform(CSV_DIR, OUT_PATH);

      expect(writeSpy).toHaveBeenCalledTimes(1);
      const [writtenPath, content] = writeSpy.mock.calls[0] as [
        string,
        string,
      ];
      expect(writtenPath).toBe(OUT_PATH);
      expect(content).not.toMatch(/^\s+"/m);
      const parsed: unknown[] = JSON.parse(content);
      expect(parsed.length).toBeGreaterThan(0);
    },
    30_000,
  );

  it(
    'each PROJECTION_TYPE has at least one row',
    async () => {
      await runTransform(CSV_DIR, OUT_PATH);
      const [, content] = writeSpy.mock.calls[0] as [string, string];
      const parsed: Array<{ type: string }> = JSON.parse(content);
      for (const type of Object.values(PROJECTION_TYPES)) {
        const count = parsed.filter((p) => p.type === type).length;
        expect(count).toBeGreaterThan(0);
      }
    },
    30_000,
  );

  it(
    'does not emit market-potential rows (D3.4 retirement)',
    async () => {
      await runTransform(CSV_DIR, OUT_PATH);
      const [, content] = writeSpy.mock.calls[0] as [string, string];
      const parsed: Array<{ type: string }> = JSON.parse(content);
      expect(parsed.some((p) => p.type === 'market-potential')).toBe(false);
    },
    30_000,
  );

  it('throws when the CSV directory does not exist', async () => {
    await expect(runTransform('/nonexistent/dir', OUT_PATH)).rejects.toThrow();
  });

  it('throws listing empty types when all indicators are unknown', async () => {
    jest.spyOn(ProjectionsParser, 'parseFromFile').mockResolvedValue({
      projections: [],
      nextId: 1,
      unknownIndicators: ['bad_indicator'],
      unknownCountries: [],
    });
    await expect(runTransform(CSV_DIR, OUT_PATH)).rejects.toThrow(/Zero rows/);
  });
});
