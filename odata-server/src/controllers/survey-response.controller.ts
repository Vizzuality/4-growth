import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";

import { SurveyResponse } from '../entities/survey-response.entity';

import { AppDataSource } from '../ormconfig';
import { createQuery } from 'odata-v4-pg';

// example: https://github.com/jaystack/odata-v4-server-pgsql-example

@odata.type(SurveyResponse)
export class SurveyResponseController extends ODataController {

  constructor() {
    super();
  }

  @odata.GET
  async getSurveyResponses(@odata.query query: ODataQuery): Promise<SurveyResponse[]> {
    const sqlQuery = createQuery(query);
    const repo = AppDataSource.getRepository(SurveyResponse);
    const res: any[] = await repo.query(sqlQuery.from('survey_responses'), sqlQuery.parameters)
    console.log('res', res)
    return res
  }

}