import { Injectable } from '@nestjs/common';
import { Country } from '@shared/dto/countries/country.entity';

@Injectable()
export class CountriesService {
  private readonly country: Country[] = [];

  create(country: Country) {
    this.country.push(country);
  }

  findAll(): Country[] {
    return this.country;
  }

  findOne(id: number) {
    return this.country.find((country) => country.id === id);
  }

  update(id: number) {
    const index = this.country.findIndex((country) => country.id === id);
    if (index === -1) {
      return 'Country not found';
    }
    this.country[index] = { ...this.country[index], name: 'Country updated' };
    return 'Country updated';
  }

  remove(id: number) {
    const index = this.country.findIndex((country) => country.id === id);
    if (index === -1) {
      return 'Country not found';
    }
    this.country.splice(index, 1);
    return 'Country removed';
  }
}
