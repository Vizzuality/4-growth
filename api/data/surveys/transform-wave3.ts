import * as path from 'path';
import {
  WAVE3_VARIABLE_TO_QUESTION,
  hasQuestionMapping,
} from './wave3-variable-mapping';
import { transformWaveFromOData } from './transform-wave';

export { SurveyAnswer } from './transform-wave';

export async function transformWave3FromOData(
  wave3Dir: string,
  outputPath: string,
): Promise<void> {
  await transformWaveFromOData({
    waveNumber: 3,
    inputDir: wave3Dir,
    outputPath,
    variableMapping: WAVE3_VARIABLE_TO_QUESTION,
    hasQuestionMapping,
  });
}

export const transformWave3 = async (): Promise<void> => {
  const wave3Dir = path.resolve(__dirname, 'wave3');
  const outputPath = path.resolve(__dirname, 'surveys-wave3.json');

  await transformWave3FromOData(wave3Dir, outputPath);
};

if (require.main === module) {
  transformWave3()
    .then(() => {
      console.log('Wave 3 transformation completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Wave 3 transformation failed:', error);
      process.exit(1);
    });
}
