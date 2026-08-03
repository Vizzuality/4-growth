import { transform } from './transform';

if (require.main === module) {
  void transform('data/surveys/wave2', `${__dirname}/surveys-wave2.json`);
}
