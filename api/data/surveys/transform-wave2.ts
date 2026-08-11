import { transform } from './transform';

export const transformWave2 = () =>
  transform('data/surveys/wave2', `${__dirname}/surveys-wave2.json`, 'level3');

if (require.main === module) {
  void transformWave2();
}
