import { Global, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiEventEntity } from '@shared/dto/api-events/api-events.entity';
import { ApiEventsService } from '@api/modules/api-events/api-events.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ApiEventEntity])],
  providers: [ApiEventsService],
  exports: [ApiEventsService],
})
export class ApiEventsModule {}
