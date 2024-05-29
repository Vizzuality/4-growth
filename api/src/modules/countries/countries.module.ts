import { Module } from '@nestjs/common';
import { CountriesController } from '@api/modules/countries/countries.controller';
import { CountriesService } from '@api/modules/countries/countries.service';
import { Country } from '@shared/dto/countries/country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}
