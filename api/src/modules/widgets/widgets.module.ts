import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@api/modules/auth/auth.module';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { CustomWidget } from '@shared/dto/widgets/custom-widget.entity';
import { CustomWidgetService } from '@api/modules/widgets/custom-widgets.service';
import { CustomWidgetsController } from '@api/modules/widgets/custom-widgets.controller';
import { PageFiltersService } from '@api/modules/widgets/page-filters.service';
import { PageFiltersController } from '@api/modules/widgets/page-filters.controller';
import { PageFilter } from '@shared/dto/widgets/page-filter.entity';
import { WidgetsController } from '@api/modules/widgets/widgets.controller';
import { WidgetsService } from '@api/modules/widgets/widgets.service';
import { PostgresSurveyDataRepository } from '@api/infrastructure/postgres-survey-data.repository';
import { SQLAdapter } from '@api/infrastructure/sql-adapter';
import { SurveyDataRepository } from '@api/infrastructure/survey-data-repository.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([BaseWidget, CustomWidget, PageFilter]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    SQLAdapter,
    { provide: SurveyDataRepository, useClass: PostgresSurveyDataRepository },
    CustomWidgetService,
    PageFiltersService,
    WidgetsService,
  ],
  controllers: [
    CustomWidgetsController,
    PageFiltersController,
    WidgetsController,
  ],
})
export class WidgetsModule {}
