import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CountriesService } from './countries.service';
import { Country } from '@shared/dto/countries/country.entity';
import { CreateCountryDto } from '@shared/dto/countries/create-country.dto';

@Controller('countries')
export class CountriesController {
  constructor(private countriesService: CountriesService) {}

  @Post()
  async create(@Body() createCountryDto: CreateCountryDto) {
    this.countriesService.create(createCountryDto);
  }

  @Get()
  async findAll(): Promise<Country[]> {
    return this.countriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.countriesService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string) {
    return this.countriesService.update(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.countriesService.remove(+id);
  }
}
