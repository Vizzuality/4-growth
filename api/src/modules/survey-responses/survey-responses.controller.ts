import { Controller, Get, Inject } from '@nestjs/common';
import {
  ODataClient,
  OdataClientInterface,
} from '@api/modules/odata/ODataClient';
import { Public } from '@api/decorators/is-public.decorator';

@Controller('survey-responses')
export class SurveyResponsesController {
  constructor(
    @Inject(ODataClient) protected readonly odata: OdataClientInterface,
  ) {}

  @Public()
  @Get('/test')
  async getAll() {
    return this.odata.getAll('');
  }
}
