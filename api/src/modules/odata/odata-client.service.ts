import { Injectable } from '@nestjs/common';
import { OdataClientInterface } from '@api/modules/odata/ODataClient';
import { OData } from '@odata/client';

@Injectable()
export class OdataService implements OdataClientInterface {
  private readonly odataClient: OData;

  constructor() {
    this.odataClient = OData.New4({
      serviceEndpoint: 'http://localhost:4001/odata/',
    });
  }

  async getAll(query: string): Promise<any> {
    const result = await this.odataClient.newRequest({
      collection: 'SurveyResponse',
    });
    return result;
  }
}
