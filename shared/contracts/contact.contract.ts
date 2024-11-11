import { initContract } from '@ts-rest/core';
import { JSONAPIError } from '@shared/dto/errors/json-api.error';
import { ContactUsSchema } from '@shared/schemas/contact.schema';

const contract = initContract();
export const contactContract = contract.router({
  contact: {
    method: 'POST',
    path: '/contact',
    responses: {
      201: contract.type<null>(),
      400: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
    body: ContactUsSchema,
  },
});
