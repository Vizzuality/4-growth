import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from '@api/app.service';
import { UsersModule } from '@api/modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeORMConfig } from '@api/typeorm.config';
import { AuthModule } from '@api/modules/auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from '@api/filters/all-exceptions.exception.filter';
import { JwtAuthGuard } from '@api/guards/jwt-auth.guard';
import { TsRestModule } from '@ts-rest/nest';
import { EmailModule } from './modules/email/email.module';
import { ContactMailer } from '@api/contact.mailer';
import { ApiEventsModule } from '@api/modules/api-events/api-events.module';
import { SectionsModule } from './modules/sections/sections.module';
import { WidgetsModule } from '@api/modules/widgets/widgets.module';
import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { LoggingModule } from '@api/modules/logging/logging.module';
import { SQLAdapter } from '@api/infrastructure/sql-adapter';

@Module({
  imports: [
    TsRestModule.register({
      isGlobal: true,
      validateRequestBody: true,
      validateRequestQuery: true,
    }),
    TypeOrmModule.forRoot(getTypeORMConfig()),
    LoggingModule,
    UsersModule,
    AuthModule,
    EmailModule,
    ApiEventsModule,
    SectionsModule,
    WidgetsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    ContactMailer,
    SQLAdapter, // Weird but works, let's move on. The logger was useful so the utility object became a class
    DataSourceManager,
  ],
})
export class AppModule implements OnModuleInit {
  public constructor(private readonly dataSourceManager: DataSourceManager) {}

  public async onModuleInit() {
    // Wait for all the initial data to be loaded to avoid conflicts when testing
    await this.dataSourceManager.loadQuestionIndicatorMap();
    await Promise.all([
      this.dataSourceManager.loadPageFilters(),
      this.dataSourceManager.loadPageSections(),
      this.dataSourceManager.loadMockData(),
    ]);
  }
}
