import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { JSONAPIError } from '@shared/dto/errors/json-api.error';
import {
  ApiPaginationResponse,
  ApiResponse,
} from '@shared/dto/global/api-response.dto';
import { generateEntityQuerySchema } from '@shared/schemas/query-param.schema';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { WidgetVisualizationFilterSchema } from '@shared/schemas/widget-visualisation-filters.schema';
import { WidgetDataFiltersSchema } from '@shared/schemas/widget-data-filters.schema';
import { BaseWidgetWithData } from '@shared/dto/widgets/base-widget-data.interface';

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
    query: generateEntityQuerySchema(BaseWidget).merge(
      WidgetVisualizationFilterSchema,
    ),
  },
  getWidget: {
    method: 'GET',
    path: '/widgets/:id',
    pathParams: z.object({
      id: z.coerce.string(),
    }),
    query: generateEntityQuerySchema(BaseWidget).merge(WidgetDataFiltersSchema),
    responses: {
      200: contract.type<ApiResponse<BaseWidgetWithData>>(),
      400: contract.type<JSONAPIError>(),
    },
    summary: 'Get a widget by id',
  },
});
