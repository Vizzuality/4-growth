import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@api/modules/auth/auth.module';
import { SQLAdapter } from '@api/infrastructure/sql-adapter';
import { ProjectionsController } from '@api/modules/projections/projections.controller';
import { Projection } from '@shared/dto/projections/projection.entity';
import { ProjectionData } from '@shared/dto/projections/projection-data.entity';
import { ProjectionWidget } from '@shared/dto/projections/projection-widget.entity';
import { ProjectionsService } from '@api/modules/projections/projections.service';
import { PostgresProjectionDataRepository } from '@api/infrastructure/postgres-projection-data.repository';
import { ProjectionDataRepository } from '@api/infrastructure/projection-data-repository.interface';
import { ProjectionFilter } from '@shared/dto/projections/projection-filter.entity';
import { ProjectionType } from '@shared/dto/projections/projection-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Projection,
      ProjectionData,
      ProjectionWidget,
      ProjectionFilter,
      ProjectionType,
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    SQLAdapter,
    {
      provide: ProjectionDataRepository,
      useClass: PostgresProjectionDataRepository,
    },
    ProjectionsService,
  ],
  controllers: [ProjectionsController],
})
export class ProjectionsModule {}
