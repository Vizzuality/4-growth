import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from '@api/app.service';
import { UsersModule } from '@api/modules/users/users.module';
import { CountriesModule } from '@api/modules/countries/countries.module';
import { User } from '@shared/dto/users/user.entity';
import { Country } from '@shared/dto/countries/country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as config from '@shared/config/development.json';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: config.db.username,
      password: config.db.password,
      database: config.db.database,
      entities: [User, Country],
      synchronize: true,
    }),

    UsersModule,
    CountriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
