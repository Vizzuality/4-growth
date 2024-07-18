import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    TsRestModule.register({ isGlobal: true, validateRequestBody: true }),
    TypeOrmModule.forRoot(getTypeORMConfig()),
    UsersModule,
    AuthModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
