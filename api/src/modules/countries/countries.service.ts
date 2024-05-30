import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '@shared/dto/countries/country.entity';
import { CreateCountryDto } from '@shared/dto/countries/create-country.dto';
import { Repository } from 'typeorm';
import { UpdateCountryDto } from '@shared/dto/countries/update-country.dto';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country) private countryRepository: Repository<Country>,
  ) {}

  async save(createCountryDto: CreateCountryDto) {
    return this.countryRepository.save(createCountryDto);
  }

  async find(): Promise<Country[]> {
    return this.countryRepository.find();
  }

  async findOneBy(id: string) {
    return this.countryRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateCountryDto) {
    return this.countryRepository.update(id, dto);
  }

  async remove(id: string) {
    const country = await this.findOneBy(id);

    if (!country) {
      throw new NotFoundException(`Country with id ${id} not found`);
    }

    return this.countryRepository.remove(country);
  }
}
