import { initContract } from '@ts-rest/core';
import { User } from '@shared/dto/users/user.entity';
import { UpdateUserDto } from '@shared/dto/users/update-user.dto';
import { CreateUserDto } from '@shared/dto/users/create-user.dto';

import * as z from 'zod';

const contract = initContract();
export const userContract = contract.router({
  createUser: {
    method: 'POST',
    path: '/users',
    responses: {
      201: contract.type<CreateUserDto>(),
    },
    body: contract.type<User>(),
    summary: 'Create a new user',
  },
  updateUser: {
    method: 'PUT',
    path: '/users/:id',
    responses: {
      200: contract.type<User>(),
    },
    body: contract.type<UpdateUserDto>(),
    summary: 'Update an existing user',
  },
  getUsers: {
    method: 'GET',
    path: '/users',
    responses: {
      200: contract.type<User[]>(),
    },
    query: z.object({
      take: z.string().transform(Number).optional(),
      skip: z.string().transform(Number).optional(),
      search: z.string().optional(),
    }),
    summary: 'Get all users',
  },
});
