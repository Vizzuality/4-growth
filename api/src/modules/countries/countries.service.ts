import { Injectable } from '@nestjs/common';
import { Country } from '@shared/dto/countries/country.entity';
import { CreateCountryDto } from '@shared/dto/countries/create-country.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CountriesService {
  constructor(private countryRepository: Repository<Country>) {}
  private readonly country: Country[] = [];

  create(country: CreateCountryDto) {
    this.countryRepository.save(country);
  }

  findAll(): Country[] {
    return this.countryRepository.findAll();
  }

  findOne(id: number) {
    return this.countryRepository.findOne((country) => country.id === id);
  }

  update(id: number) {
    const index = this.countryRepository.findIndex(
      (country) => country.id === id,
    );
    if (index === -1) {
      return 'Country not found';
    }
    this.countryRepository[index] = {
      ...this.countryRepository[index],
      name: 'Country updated',
    };
    return 'Country updated';
  }

  remove(id: number) {
    const index = this.countryRepository.findIndex(
      (country) => country.id === id,
    );
    if (index === -1) {
      return 'Country not found';
    }
    this.countryRepository.splice(index, 1);
    return 'Country removed';
  }
}
