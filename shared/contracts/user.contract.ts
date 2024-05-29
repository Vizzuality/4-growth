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
      400: contract.type<{ message: string }>(),
    },
    body: contract.type<User>(),
    summary: 'Create a new user',
  },
  getUsers: {
    method: 'GET',
    path: '/users',
    responses: {
      200: contract.type<User[]>(),
      400: contract.type<{ message: string }>(),
    },
    query: z.object({
      take: z.string().transform(Number).optional(),
      skip: z.string().transform(Number).optional(),
      search: z.string().optional(),
    }),
    summary: 'Get all users',
  },
  getUser: {
    method: 'GET',
    path: '/users/:id',
    pathParams: z.object({
      id: z.coerce.string(),
    }),
    responses: {
      200: contract.type<User>(),
      400: contract.type<{ message: string }>(),
    },
    summary: 'Get a user by id',
  },
  updateUser: {
    method: 'PUT',
    path: '/users/:id',
    pathParams: z.object({
      id: z.coerce.string(),
    }),
    responses: {
      200: contract.type<User>(),
      400: contract.type<{ message: string }>(),
    },
    body: contract.type<UpdateUserDto>(),
    summary: 'Update an existing user',
  },
  deleteUser: {
    method: 'DELETE',
    path: '/users/:id',
    pathParams: z.object({
      id: z.coerce.string(),
    }),
    responses: {
      200: contract.type<User['id']>(),
      400: contract.type<{ message: string }>(),
    },
    body: contract.type<User['id']>(),
    summary: 'Delete an existing user',
  },
});
