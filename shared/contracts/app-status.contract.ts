import { initContract } from '@ts-rest/core';

const contract = initContract();
export const appStatusContract = contract.router({
  getStatus: {
    method: 'GET',
    path: '/status',
    responses: {
      200: contract.type<null>(),
    },
  },
});
