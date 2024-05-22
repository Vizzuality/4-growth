import { Module } from '@nestjs/common';
import { CountriesController } from '@api/modules/countries/countries.controller';
import { CountriesService } from '@api/modules/countries/countries.service';

@Module({
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}
