import { Module } from '@nestjs/common';
import { SurveyResponsesController } from './survey-responses.controller';
import { OdataModule } from '@api/modules/odata/odata.module';

@Module({
  imports: [OdataModule],
  controllers: [SurveyResponsesController],
})
export class SurveyResponsesModule {}
