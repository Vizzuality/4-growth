import { initContract } from '@ts-rest/core';
import { Country } from '@shared/dto/countries/country.entity';

import * as z from 'zod';
import { CreateCountryDto } from '@shared/dto/countries/create-country.dto';
import { UpdateCountryDto } from '@shared/dto/countries/update-country.dto';
import { DeleteCountryDto } from '@shared/dto/countries/delete-country.dto';

const contract = initContract();
export const countryContract = contract.router({
  createCountry: {
    method: 'POST',
    path: '/countries',
    responses: {
      201: contract.type<CreateCountryDto>(),
    },
    body: contract.type<Country>(),
    summary: 'Create a new country',
  },
  updateCountry: {
    method: 'PUT',
    path: '/countries/:id',
    responses: {
      200: contract.type<Country>(),
    },
    body: contract.type<UpdateCountryDto>(),
    summary: 'Update an existing country',
  },
  deleteCountry: {
    method: 'DELETE',
    path: '/countries/:id',
    responses: {
      200: contract.type<string>(),
    },
    body: contract.type<DeleteCountryDto>(),
    summary: 'Delete an existing country',
  },
  getCountries: {
    method: 'GET',
    path: '/countries',
    responses: {
      200: contract.type<Country[]>(),
    },
    query: z.object({
      take: z.string().transform(Number).optional(),
      skip: z.string().transform(Number).optional(),
      search: z.string().optional(),
    }),
    summary: 'Get all countries',
  },
  getCountry: {
    method: 'GET',
    path: '/countries/:id',
    responses: {
      200: contract.type<Country>(),
    },
    summary: 'Get a country by id',
  },
});
