import { forwardRef, Module } from '@nestjs/common';
import { SectionsController } from './sections.controller';
import { SectionsService } from '@api/modules/sections/sections.service';
import { Section } from '@shared/dto/sections/section.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@api/modules/auth/auth.module';
import { PostgresSurveyAnswerRepository } from '@api/infrastructure/postgres-survey-answers.repository';
import { SQLAdapter } from '@api/infrastructure/sql-adapter';
import { SurveyAnswerRepository } from '@api/infrastructure/survey-answer-repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Section]), forwardRef(() => AuthModule)],
  providers: [
    SQLAdapter,
    {
      provide: SurveyAnswerRepository,
      useClass: PostgresSurveyAnswerRepository,
    },
    SectionsService,
  ],
  controllers: [SectionsController],
})
export class SectionsModule {}
