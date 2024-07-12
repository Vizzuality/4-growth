import { initContract } from '@ts-rest/core';
import { IAccessToken } from '@shared/dto/auth/access-token.interface';
import { JSONAPIError } from '@shared/dto/errors/json-api.error';
import { SignInSchema, SignUpSchema } from '@shared/schemas/auth.schemas';

const contract = initContract();
export const authContract = contract.router({
  signUp: {
    method: 'POST',
    path: '/auth/sign-up',
    responses: {
      201: contract.type<null>(),
      400: contract.type<JSONAPIError>(),
      409: contract.type<JSONAPIError>(),
    },
    body: SignUpSchema,
  },
  signIn: {
    method: 'POST',
    path: '/auth/sign-in',
    responses: {
      201: contract.type<IAccessToken>(),
      401: contract.type<JSONAPIError>(),
    },
    body: SignInSchema,
  },
});
