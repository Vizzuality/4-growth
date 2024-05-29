import { initContract } from '@ts-rest/core';
import { Country } from '@shared/dto/countries/country.entity';

import * as z from 'zod';
import { CreateCountryDto } from '@shared/dto/countries/create-country.dto';
import { UpdateCountryDto } from '@shared/dto/countries/update-country.dto';

const contract = initContract();
export const countryContract = contract.router({
  createCountry: {
    method: 'POST',
    path: '/countries',
    responses: {
      201: contract.type<CreateCountryDto>(),
      404: contract.type<{ message: string }>(),
    },
    body: contract.type<Country>(),
    summary: 'Create a new country',
  },
  getCountries: {
    method: 'GET',
    path: '/countries',
    responses: {
      200: contract.type<Country[]>(),
      400: contract.type<{ message: string }>(),
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
    pathParams: z.object({
      id: z.coerce.string(),
    }),
    responses: {
      200: contract.type<Country>(),
    },
    summary: 'Get a country by id',
  },
  updateCountry: {
    method: 'PUT',
    path: '/countries/:id',
    pathParams: z.object({
      id: z.coerce.string(),
    }),
    responses: {
      200: contract.type<Country>(),
    },
    body: contract.type<UpdateCountryDto>(),
    summary: 'Update an existing country',
  },
  deleteCountry: {
    method: 'DELETE',
    path: '/countries/:id',
    pathParams: z.object({
      id: z.coerce.string(),
    }),
    responses: {
      200: contract.type<Country['id']>(),
      400: contract.type<{ message: string }>(),
    },
    body: contract.type<Country['id']>(),
    summary: 'Delete an existing country',
  },
});
