import { Module } from '@nestjs/common';
import { OdataService } from '@api/modules/odata/odata-client.service';
import { ODataClient } from '@api/modules/odata/ODataClient';

@Module({
  providers: [{ provide: ODataClient, useClass: OdataService }],
  exports: [ODataClient],
})
export class OdataModule {}
