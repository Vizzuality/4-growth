import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { JSONAPIError } from '@shared/dto/errors/json-api.error';
import {
  ApiPaginationResponse,
  ApiResponse,
} from '@shared/dto/global/api-response.dto';
import { SavedProjection } from '@shared/dto/projections/saved-projection.entity';
import {
  CreateSavedProjectionSchema,
  UpdateSavedProjectionSchema,
} from '@shared/schemas/saved-projection.schema';
import { generateEntityQuerySchema } from '@shared/schemas/query-param.schema';

const contract = initContract();
export const savedProjectionsContract = contract.router({
  searchSavedProjections: {
    method: 'GET',
    path: '/users/:userId/saved-projections',
    pathParams: z.object({ userId: z.string().uuid() }),
    query: generateEntityQuerySchema(SavedProjection),
    responses: {
      200: contract.type<ApiPaginationResponse<SavedProjection>>(),
      401: contract.type<JSONAPIError>(),
      403: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
  },
  findSavedProjection: {
    method: 'GET',
    path: '/users/:userId/saved-projections/:id',
    pathParams: z.object({ userId: z.string().uuid(), id: z.coerce.number() }),
    responses: {
      200: contract.type<ApiResponse<SavedProjection>>(),
      401: contract.type<JSONAPIError>(),
      403: contract.type<JSONAPIError>(),
      404: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
  },
  createSavedProjection: {
    method: 'POST',
    path: '/users/:userId/saved-projections',
    pathParams: z.object({ userId: z.string().uuid() }),
    body: CreateSavedProjectionSchema,
    responses: {
      201: contract.type<ApiResponse<SavedProjection>>(),
      400: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
  },
  updateSavedProjection: {
    method: 'PATCH',
    path: '/users/:userId/saved-projections/:id',
    pathParams: z.object({ userId: z.string().uuid(), id: z.coerce.number() }),
    body: UpdateSavedProjectionSchema,
    responses: {
      200: contract.type<ApiResponse<SavedProjection>>(),
      400: contract.type<JSONAPIError>(),
      404: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
  },
  deleteSavedProjection: {
    method: 'DELETE',
    path: '/users/:userId/saved-projections/:id',
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
