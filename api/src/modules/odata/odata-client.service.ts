import { Injectable } from '@nestjs/common';
import { OdataClientInterface } from '@api/modules/odata/odata.interface';
import { OData } from '@odata/client';

@Injectable()
export class OdataService implements OdataClientInterface {
  private readonly odataClient: OData;

  constructor() {
    this.odataClient = OData.New({
      serviceEndpoint: 'http://localhost:4001/odata',
    });
  }

  async getAll(query: string): Promise<any> {
    return this.odataClient.newRequest({ collection: 'SurveyResponses' });
  }
}
