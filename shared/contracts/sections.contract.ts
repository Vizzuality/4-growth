import { JSONAPIError } from '@shared/dto/errors/json-api.error';
import { ApiPaginationResponse } from '@shared/dto/global/api-response.dto';
import { SectionWithDataWidget } from '@shared/dto/sections/section.entity';
import { generateEntityQuerySchema } from '@shared/schemas/query-param.schema';
import { SearchWidgetDataFiltersSchema } from '@shared/schemas/search-widget-data-params.schema';
import { initContract } from '@ts-rest/core';

const contract = initContract();
export const sectionContract = contract.router({
  getSections: {
    method: 'GET',
    path: '/sections',
    query: generateEntityQuerySchema(SectionWithDataWidget).merge(
      SearchWidgetDataFiltersSchema,
    ),
    responses: {
      200: contract.type<ApiPaginationResponse<SectionWithDataWidget>>(),
      400: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
  },
});
