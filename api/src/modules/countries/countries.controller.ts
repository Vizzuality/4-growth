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
import { UpdateCountryDto } from '@shared/dto/countries/update-country.dto';

@Controller('countries')
export class CountriesController {
  constructor(private countriesService: CountriesService) {}

  @Post()
  async save(@Body() createCountryDto: CreateCountryDto) {
    return this.countriesService.save(createCountryDto);
  }

  @Get()
  async find(): Promise<Country[]> {
    return this.countriesService.find();
  }

  @Get(':id')
  async findOneBy(@Param('id') id: string) {
    return this.countriesService.findOneBy(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCountryDto) {
    return this.countriesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.countriesService.remove(id);
  }
}
