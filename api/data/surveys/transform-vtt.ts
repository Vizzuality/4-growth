import * as path from 'path';
import { transform } from './transform';

export const transformVTT = () =>
  transform(
    'data/surveys',
    path.join(process.cwd(), 'data/surveys/surveys-vtt.json'),
    'level2',
    new Map(),
    undefined,
    new Set(),
    'vtt-only',
  );

if (require.main === module) {
  void transformVTT();
}
