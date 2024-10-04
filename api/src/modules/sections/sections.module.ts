import { forwardRef, Module } from '@nestjs/common';
import { SectionsController } from './sections.controller';
import { SectionsService } from '@api/modules/sections/sections.service';
import { Section } from '@shared/dto/sections/section.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@api/modules/auth/auth.module';
import { PostgresSurveyDataRepository } from '@api/infrastructure/postgres-survey-data.repository';
import { SQLAdapter } from '@api/infrastructure/sql-adapter';

@Module({
  imports: [TypeOrmModule.forFeature([Section]), forwardRef(() => AuthModule)],
  providers: [
    SQLAdapter,
    { provide: 'SurveyDataRepository', useClass: PostgresSurveyDataRepository },
    SectionsService,
  ],
  controllers: [SectionsController],
})
export class SectionsModule {}
