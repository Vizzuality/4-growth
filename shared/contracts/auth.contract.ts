import { initContract } from '@ts-rest/core';
import { SignUpDto } from '@shared/dto/auth/sign-up.dto';

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
});
