import { initContract } from '@ts-rest/core';
import { Country } from '@shared/dto/countries/country.entity';

import * as z from 'zod';

const contract = initContract();
export const userContract = contract.router({
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
});
