import { initContract } from '@ts-rest/core';
import { UpdateUserDto } from '@shared/dto/users/update-user.dto';
import { CreateUserDto } from '@shared/dto/users/create-user.dto';

import * as z from 'zod';
import { API_ROUTES } from '@shared/contracts/routes';
import { JSONAPIError } from '@shared/dto/errors/json-api.error';
import { UserDto } from '@shared/dto/users/user.dto';

const contract = initContract();
export const userContract = contract.router({
  createUser: {
    method: 'POST',
    path: API_ROUTES.users.handlers.createUser.getRoute(),
    responses: {
      201: contract.type<UserDto>(),
      400: contract.type<{ message: string }>(),
    },
    body: contract.type<CreateUserDto>(),
    summary: 'Create a new user',
  },
  getUsers: {
    method: 'GET',
    path: API_ROUTES.users.handlers.getUsers.getRoute(),
    responses: {
      200: contract.type<UserDto[]>(),
      400: contract.type<{ message: string }>(),
    },
    summary: 'Get all users',
  },
  findMe: {
    method: 'GET',
    path: API_ROUTES.users.handlers.me.getRoute(),
    responses: {
      200: contract.type<UserDto>(),
      401: contract.type<JSONAPIError>(),
    },
  },
  getUser: {
    method: 'GET',
    path: API_ROUTES.users.handlers.getUser.getRoute(),
    pathParams: z.object({
      id: z.coerce.string(),
    }),
    responses: {
      200: contract.type<UserDto>(),
      400: contract.type<JSONAPIError>(),
      401: contract.type<JSONAPIError>(),
    },
    summary: 'Get a user by id',
  },
  updateUser: {
    method: 'PATCH',
    path: API_ROUTES.users.handlers.updateUser.getRoute(),
    pathParams: z.object({
      id: z.coerce.string(),
    }),
    responses: {
      200: contract.type<UserDto>(),
      400: contract.type<JSONAPIError>(),
      401: contract.type<JSONAPIError>(),
    },
    body: contract.type<UpdateUserDto>(),
    summary: 'Update an existing user',
  },
  deleteMe: {
    method: 'DELETE',
    path: API_ROUTES.users.handlers.deleteMe.getRoute(),
    responses: {
      200: null,
      400: contract.type<JSONAPIError>(),
      401: contract.type<JSONAPIError>(),
    },
    body: null,
  },
});
