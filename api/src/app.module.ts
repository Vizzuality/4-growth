import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from '@api/app.service';
import { UsersModule } from '@api/modules/users/users.module';
import { CountriesModule } from '@api/modules/countries/countries.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '@api/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), UsersModule, CountriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
