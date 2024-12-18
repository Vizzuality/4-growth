import { initContract } from '@ts-rest/core';
import { UpdateUserDto } from '@shared/dto/users/update-user.dto';
import { CreateUserDto } from '@shared/dto/users/create-user.dto';
import { z } from 'zod';
import { JSONAPIError } from '@shared/dto/errors/json-api.error';
import { UserDto } from '@shared/dto/users/user.dto';
import { UpdateUserPasswordDto } from '@shared/dto/users/update-user-password.dto';
import {
  ApiPaginationResponse,
  ApiResponse,
} from '@shared/dto/global/api-response.dto';
import { PasswordSchema } from '@shared/schemas/auth.schemas';
import { CustomWidget } from '@shared/dto/widgets/custom-widget.entity';
import {
  CreateCustomWidgetSchema,
  UpdateCustomWidgetSchema,
} from '@shared/schemas/widget.schemas';
import { generateEntityQuerySchema } from '@shared/schemas/query-param.schema';
import { User } from '@shared/dto/users/user.entity';

const contract = initContract();
export const usersContract = contract.router({
  createUser: {
    method: 'POST',
    path: '/users',
    responses: {
      201: contract.type<ApiResponse<UserDto>>(),
      400: contract.type<{ message: string }>(),
      500: contract.type<JSONAPIError>(),
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
      500: contract.type<JSONAPIError>(),
    },
    summary: 'Get all users',
    query: generateEntityQuerySchema(User),
  },
  findMe: {
    method: 'GET',
    path: '/users/me',
    responses: {
      200: contract.type<ApiResponse<UserDto>>(),
      401: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
    query: generateEntityQuerySchema(User),
  },
  updatePassword: {
    method: 'PATCH',
    path: '/users/me/password',
    responses: {
      200: contract.type<ApiResponse<UserDto>>(),
      400: contract.type<JSONAPIError>(),
      401: contract.type<JSONAPIError>(),
      404: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
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
      404: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
    query: generateEntityQuerySchema(User),
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
      404: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
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
      500: contract.type<JSONAPIError>(),
    },
    body: null,
  },
  resetPassword: {
    method: 'POST',
    path: '/users/me/password/reset',
    responses: {
      200: contract.type<null>(),
      400: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
    body: PasswordSchema,
  },
  // Custom Widgets
  searchCustomWidgets: {
    method: 'GET',
    path: '/users/:userId/widgets',
    pathParams: z.object({ userId: z.string().uuid() }),
    query: generateEntityQuerySchema(CustomWidget),
    responses: {
      200: contract.type<ApiPaginationResponse<CustomWidget>>(),
      401: contract.type<JSONAPIError>(),
      403: contract.type<JSONAPIError>(),
      404: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
  },
  findCustomWidget: {
    method: 'GET',
    path: '/users/:userId/widgets/:id',
    pathParams: z.object({ userId: z.string().uuid(), id: z.coerce.number() }),
    responses: {
      200: contract.type<ApiResponse<CustomWidget>>(),
      400: contract.type<JSONAPIError>(),
      401: contract.type<JSONAPIError>(),
      403: contract.type<JSONAPIError>(),
      404: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
  },
  createCustomWidget: {
    method: 'POST',
    path: '/users/:userId/widgets',
    pathParams: z.object({ userId: z.string().uuid() }),
    body: CreateCustomWidgetSchema,
    responses: {
      201: contract.type<ApiResponse<CustomWidget>>(),
      400: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
  },
  updateCustomWidget: {
    method: 'PATCH',
    path: '/users/:userId/widgets/:id',
    pathParams: z.object({ userId: z.string().uuid(), id: z.coerce.number() }),
    body: UpdateCustomWidgetSchema,
    responses: {
      200: contract.type<ApiResponse<CustomWidget>>(),
      400: contract.type<JSONAPIError>(),
      404: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
  },
  deleteCustomWidget: {
    method: 'DELETE',
    path: '/users/:userId/widgets/:id',
    pathParams: z.object({ userId: z.string().uuid(), id: z.coerce.number() }),
    body: null,
    responses: {
      204: contract.type<null>(),
      400: contract.type<JSONAPIError>(),
      404: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
  },
});
