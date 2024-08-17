import { odata, ODataServer } from 'odata-v4-server';
import { SurveyResponseController } from './controllers/survey-response.controller';

@odata.cors
@odata.controller(SurveyResponseController, true)
export class FourGrowthODataServer extends ODataServer {}