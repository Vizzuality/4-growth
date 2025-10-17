import { Logger, Module, OnModuleInit } from '@nestjs/common';
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
import { EtlNotificationService } from '@api/infrastructure/etl-notification.service';
import { LoggingModule } from '@api/modules/logging/logging.module';
import { SQLAdapter } from '@api/infrastructure/sql-adapter';
import { TerminusModule } from '@nestjs/terminus';
import { ProjectionsModule } from '@api/modules/projections/projections.module';
import { ScheduleModule } from '@nestjs/schedule';
import * as config from 'config';
const NODE_ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TerminusModule.forRoot({ logger: NODE_ENV === 'test' ? false : true }),
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
    ProjectionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    ContactMailer,
    SQLAdapter, // Weird but works, let's move on. The logger was useful so the utility object became a class
    DataSourceManager,
    EtlNotificationService,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(this.constructor.name);

  public constructor(private readonly dataSourceManager: DataSourceManager) {}

  public async onModuleInit() {
    this.logger.log(
      `ETL CONFIG cronEnabled: ${config.get<boolean>('etl.cronEnabled')}`,
    );
    await this.dataSourceManager.loadInitialData();
  }
}
