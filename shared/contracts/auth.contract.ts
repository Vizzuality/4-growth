import { initContract } from '@ts-rest/core';
import { SignUpDto } from '@shared/dto/auth/sign-up.dto';
import { IAccessToken } from '@shared/dto/auth/access-token.interface';
import { SignInDto } from '@shared/dto/auth/sign-in.dto';
import { JSONAPIError } from '@shared/dto/errors/json-api.error';

const contract = initContract();
export const authContract = contract.router({
  signUp: {
    method: 'POST',
    // TODO: move routes to a single place so API and contract can reference them
    path: '/auth/sign-up',
    responses: {
      201: contract.type<null>(),
      400: contract.type<JSONAPIError>(),
      409: contract.type<JSONAPIError>(),
    },
    body: contract.type<SignUpDto>(),
  },
  signIn: {
    method: 'POST',
    path: '/auth/sign-in',
    responses: {
      201: contract.type<IAccessToken>(),
      401: contract.type<JSONAPIError>(),
    },
    body: contract.type<SignInDto>(),
  },
});
