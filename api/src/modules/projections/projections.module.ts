import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@api/modules/auth/auth.module';
import { SQLAdapter } from '@api/infrastructure/sql-adapter';
import { ProjectionsController } from '@api/modules/projections/projections.controller';
import { SavedProjectionsController } from '@api/modules/projections/saved-projections.controller';
import { Projection } from '@shared/dto/projections/projection.entity';
import { ProjectionData } from '@shared/dto/projections/projection-data.entity';
import { ProjectionWidget } from '@shared/dto/projections/projection-widget.entity';
import { SavedProjection } from '@shared/dto/projections/saved-projection.entity';
import { ProjectionsService } from '@api/modules/projections/projections.service';
import { SavedProjectionService } from '@api/modules/projections/saved-projections.service';
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
      SavedProjection,
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
    SavedProjectionService,
  ],
  controllers: [ProjectionsController, SavedProjectionsController],
})
export class ProjectionsModule {}
