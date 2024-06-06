import { initContract } from '@ts-rest/core';
import { SignUpDto } from '@shared/dto/auth/sign-up.dto';
import { IAccessToken } from '@shared/dto/auth/access-token.interface';
import { SignInDto } from '@shared/dto/auth/sign-in.dto';
import { JSONAPIError } from '@shared/dto/errors/json-api.error';

const contract = initContract();
export const authContract = contract.router({
  signUp: {
    method: 'POST',
    path: '/auth/sign-up',
    responses: {
      201: contract.type<null>(),
      401: contract.type<JSONAPIError>(),
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
