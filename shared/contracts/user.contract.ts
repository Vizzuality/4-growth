import { initContract } from '@ts-rest/core';
import { UpdateUserDto } from '@shared/dto/users/update-user.dto';
import { CreateUserDto } from '@shared/dto/users/create-user.dto';
import * as z from 'zod';
import { JSONAPIError } from '@shared/dto/errors/json-api.error';
import { UserDto } from '@shared/dto/users/user.dto';
import { UpdateUserPasswordDto } from '@shared/dto/users/update-user-password.dto';
import { FetchSpecification } from 'nestjs-base-service';
import {
  ApiPaginationResponse,
  ApiResponse,
} from '@shared/dto/global/api-response.dto';
import { CustomChart } from '@shared/dto/custom-charts/custom-chart.entity';
import { PasswordSchema } from '@shared/schemas/auth.schemas';

const contract = initContract();
export const userContract = contract.router({
  createUser: {
    method: 'POST',
    path: '/users',
    responses: {
      201: contract.type<ApiResponse<UserDto>>(),
      400: contract.type<{ message: string }>(),
    },
    body: contract.type<CreateUserDto>(),
    summary: 'Create a new user',
  },
  getUsers: {
    method: 'GET',
    path: '/users',
    responses: {
      200: contract.type<ApiPaginationResponse<UserDto>>(),
      400: contract.type<{ message: string }>(),
    },
    summary: 'Get all users',
    query: contract.type<FetchSpecification>(),
  },
  findMe: {
    method: 'GET',
    path: '/users/me',
    responses: {
      200: contract.type<ApiResponse<UserDto>>(),
      401: contract.type<JSONAPIError>(),
    },
    query: contract.type<FetchSpecification>(),
  },
  updatePassword: {
    method: 'PATCH',
    path: '/users/me/password',
    responses: {
      200: contract.type<ApiResponse<UserDto>>(),
      400: contract.type<JSONAPIError>(),
      401: contract.type<JSONAPIError>(),
    },
    body: contract.type<UpdateUserPasswordDto>(),
    summary: 'Update password of the user',
  },
  getUser: {
    method: 'GET',
    path: '/users/:id',
    pathParams: z.object({
      id: z.coerce.string(),
    }),
    responses: {
      200: contract.type<UserDto>(),
      400: contract.type<JSONAPIError>(),
      401: contract.type<JSONAPIError>(),
    },
    query: contract.type<FetchSpecification>(),
    summary: 'Get a user by id',
  },
  updateUser: {
    method: 'PATCH',
    path: '/users/:id',
    pathParams: z.object({
      id: z.coerce.string(),
    }),
    responses: {
      200: contract.type<ApiResponse<UserDto>>(),
      400: contract.type<JSONAPIError>(),
      401: contract.type<JSONAPIError>(),
    },
    body: contract.type<UpdateUserDto>(),
    summary: 'Update an existing user',
  },
  deleteMe: {
    method: 'DELETE',
    path: '/users/me',
    responses: {
      200: null,
      400: contract.type<JSONAPIError>(),
      401: contract.type<JSONAPIError>(),
    },
    body: null,
  },
  getUsersCustomCharts: {
    method: 'GET',
    path: '/users/:id/custom-charts',
    pathParams: z.object({ id: z.string() }),
    query: contract.type<FetchSpecification>(),
    responses: {
      200: contract.type<ApiPaginationResponse<CustomChart>>(),
      400: contract.type<JSONAPIError>(),
    },
  },
  resetPassword: {
    method: 'POST',
    path: '/users/me/password/reset',
    responses: {
      200: contract.type<null>(),
      400: contract.type<JSONAPIError>(),
    },
    body: PasswordSchema,
  },
});
