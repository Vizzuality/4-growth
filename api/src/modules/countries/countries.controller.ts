import { Controller, Get } from '@nestjs/common';

@Controller()
export class CountriesController {
  @Get('countries')
  createCountry() {
    return 'This action adds a new country';
  }
}
