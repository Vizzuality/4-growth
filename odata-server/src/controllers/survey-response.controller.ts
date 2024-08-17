import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";

import { SurveyResponse } from '../entities/survey-response.entity';
import { Repository } from 'typeorm';
import { AppDataSource } from '../ormconfig';


// TODO: To show jsons serialized results, the type of the controller needs to be a class with Edm annotations

export class Product {
  @Edm.Int32
  Id: number;

  @Edm.String
  Name: string;

}

@odata.type(Product)
export class SurveyResponseController extends ODataController {
  private surveyResponseRepository: Repository<SurveyResponse>;

  constructor() {
    super();
    this.surveyResponseRepository = AppDataSource.getRepository(SurveyResponse);
  }

  @odata.GET
  async getSurveyResponses(@odata.query query: ODataQuery): Promise<SurveyResponse[]> {
    const arr = []
    for(const n of [1,2,3,4,5] ){
      const product = new Product()
      product.Id = n
      product.Name = `product ${n}`
      arr.push(product)
    }
   return arr as any
    //return 'test' as any
  }

  @odata.GET
  async getSurveyResponse(@odata.key key: number): Promise<SurveyResponse | null> {
    return this.surveyResponseRepository.findOneBy({ id: key });
  }

  @odata.POST
  async createSurveyResponse(@odata.body data: SurveyResponse): Promise<SurveyResponse> {
    const newSurveyResponse = this.surveyResponseRepository.create(data);
    return this.surveyResponseRepository.save(newSurveyResponse);
  }

  @odata.PUT
  async updateSurveyResponse(@odata.key key: number, @odata.body data: Partial<SurveyResponse>): Promise<SurveyResponse | null> {
    await this.surveyResponseRepository.update(key, data);
    return this.surveyResponseRepository.findOneBy({ id: key });
  }

  @odata.DELETE
  async deleteSurveyResponse(@odata.key key: number): Promise<void> {
    await this.surveyResponseRepository.delete(key);
  }
}