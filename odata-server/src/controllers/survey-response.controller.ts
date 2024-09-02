import { ODataController, odata, ODataQuery } from "odata-v4-server";

import { SurveyResponse } from '../entities/survey-response.entity';

import { AppDataSource } from '../ormconfig';
import { createQuery } from 'odata-v4-pg';

// example: https://github.com/jaystack/odata-v4-server-pgsql-example


// Instantiation of classes by OData Server is pure magic and we can't use dependency injection, private methods or constructor parameters, so we need to repeat lots of code.
// Hopefully this is affordable as the server is only for development purposes.

@odata.type(SurveyResponse)
export class SurveyResponseController extends ODataController {


  @odata.GET
  async getSurveyResponses(@odata.query query: ODataQuery): Promise<SurveyResponse[]> {
    const formattedQuery = createQuery(query);
    const entityManager = AppDataSource.createEntityManager();
    return entityManager.query(formattedQuery.from('survey_responses'), formattedQuery.parameters);

  }

}