import { transform } from './transform';

export const transformWave2v2 = () =>
  transform('data/surveys/wave2', `${__dirname}/surveys-wave2.json`);

if (require.main === module) {
  void transformWave2v2();
}
