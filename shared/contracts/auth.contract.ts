import { initContract } from '@ts-rest/core';
import { SignUpDto } from '@shared/dto/auth/sign-up.dto';
import { IAccessToken } from '@shared/dto/auth/access-token.interface';
import { SignInDto } from '@shared/dto/auth/sign-in.dto';

const contract = initContract();
export const authContract = contract.router({
  signUp: {
    method: 'POST',
    path: '/auth/sign-up',
    responses: {
      201: contract.type<null>(),
      // TODO: Define a global error type
    },
    body: contract.type<SignUpDto>(),
    summary: 'Sign a new user up',
  },
  signIn: {
    method: 'POST',
    path: '/auth/sign-in',
    responses: {
      200: contract.type<IAccessToken>(),
      // TODO: Define a global error type
    },
    body: contract.type<SignInDto>(),
    summary: 'Sign a user in, issuing a JWT token.',
  },
});
