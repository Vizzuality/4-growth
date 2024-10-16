import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { JSONAPIError } from '@shared/dto/errors/json-api.error';
import {} from '@shared/schemas/widget.schemas';
import {
  ApiPaginationResponse,
  ApiResponse,
} from '@shared/dto/global/api-response.dto';
import { generateEntityQuerySchema } from '@shared/schemas/query-param.schema';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';

const contract = initContract();
export const widgetsContract = contract.router({
  getWidgets: {
    method: 'GET',
    path: '/widgets',
    responses: {
      200: contract.type<ApiPaginationResponse<BaseWidget>>(),
      400: contract.type<JSONAPIError>(),
    },
    summary: 'Get all widgets',
    query: generateEntityQuerySchema(BaseWidget),
  },
  getWidget: {
    method: 'GET',
    path: '/widgets/:id',
    pathParams: z.object({
      id: z.coerce.string().uuid(),
    }),
    query: generateEntityQuerySchema(BaseWidget),
    responses: {
      200: contract.type<ApiResponse<BaseWidget>>(),
      400: contract.type<JSONAPIError>(),
    },
    summary: 'Get a widget by id',
  },
});
