import { buildCsvFilename } from '@api/modules/widgets/csv/filename';

describe('buildCsvFilename', () => {
  const refDate = new Date('2026-04-13T10:30:00Z');

  it('slugifies title and appends ISO date with .csv extension', () => {
    expect(buildCsvFilename('Total Surveys', refDate)).toBe(
      'total-surveys-2026-04-13.csv',
    );
  });

  it('replaces punctuation and collapses repeated separators', () => {
    expect(
      buildCsvFilename('Adoption of Technology: by Country!', refDate),
    ).toBe('adoption-of-technology-by-country-2026-04-13.csv');
  });

  it('strips accents from non-ASCII characters', () => {
    expect(buildCsvFilename('Énergie & Agriculture', refDate)).toBe(
      'energie-agriculture-2026-04-13.csv',
    );
  });

  it('trims leading and trailing separators', () => {
    expect(buildCsvFilename('  --Hello--  ', refDate)).toBe(
      'hello-2026-04-13.csv',
    );
  });

  it('falls back to "widget" when title slugifies to empty', () => {
    expect(buildCsvFilename('***', refDate)).toBe('widget-2026-04-13.csv');
    expect(buildCsvFilename('', refDate)).toBe('widget-2026-04-13.csv');
  });

  it('uses UTC date regardless of local timezone', () => {
    // 2026-04-13 23:30 UTC — in some timezones this is already 2026-04-14 local.
    const date = new Date('2026-04-13T23:30:00Z');
    expect(buildCsvFilename('widget', date)).toBe('widget-2026-04-13.csv');
  });
});
