import * as path from 'path';
import {
  WAVE2_VARIABLE_TO_QUESTION,
  hasQuestionMapping,
} from './wave2-variable-mapping';
import { transformWaveFromOData } from './transform-wave';

// Re-export helpers from generic module for backward compatibility
export {
  SurveyAnswer,
  loadWaveEntities as loadWave2Entities,
  joinEntitiesByRootID,
  extractCountryFromSurvey,
  countryNameToISO3,
  filterCategoricalAnswers,
  filterValidAnswers,
  cleanAnswerText,
  getSurveyId,
} from './transform-wave';

export async function transformWave2FromOData(
  wave2Dir: string,
  outputPath: string,
): Promise<void> {
  await transformWaveFromOData({
    waveNumber: 2,
    inputDir: wave2Dir,
    outputPath,
    variableMapping: WAVE2_VARIABLE_TO_QUESTION,
    hasQuestionMapping,
  });
}

export const transformWave2 = async (): Promise<void> => {
  const wave2Dir = path.resolve(__dirname, 'wave2');
  const outputPath = path.resolve(__dirname, 'surveys-wave2.json');

  await transformWave2FromOData(wave2Dir, outputPath);
};

if (require.main === module) {
  transformWave2()
    .then(() => {
      console.log('Wave 2 transformation completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Wave 2 transformation failed:', error);
      process.exit(1);
    });
}
