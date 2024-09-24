import { forwardRef, Module } from '@nestjs/common';
import { SectionsController } from './sections.controller';
import { SectionsService } from '@api/modules/sections/sections.service';
import { Section } from '@shared/dto/sections/section.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@api/modules/auth/auth.module';
import { LoggingModule } from '@api/modules/logging/logging.module';

@Module({
  imports: [
    LoggingModule,
    TypeOrmModule.forFeature([Section]),
    forwardRef(() => AuthModule),
  ],
  providers: [SectionsService],
  controllers: [SectionsController],
})
export class SectionsModule {}
