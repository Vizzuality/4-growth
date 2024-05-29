import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '@shared/dto/countries/country.entity';
import { CreateCountryDto } from '@shared/dto/countries/create-country.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CountriesService {
  constructor(@InjectRepository(Country)  private countryRepository: Repository<Country>) {}

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

  async update(body, id: string) {
    const countryToUpdate = await this.countryRepository.findOneBy({
      id: id ,
    });

    return this.countryRepository.save(countryToUpdate)
  }

  async remove(id: string) {
    const found = await this.countryRepository.findOneBy({
      id: id,
    });
    if (!found) {
      throw new NotFoundException(`Country with ID "${id}" not found`);
    }
    if (found) {
      return this.countryRepository.remove(found);
    }

  }
}
