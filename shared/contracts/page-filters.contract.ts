import { JSONAPIError } from '@shared/dto/errors/json-api.error';
import { ApiResponse } from '@shared/dto/global/api-response.dto';
import { PageFilter } from '@shared/dto/widgets/page-filter.entity';
import { SearchFiltersSchema } from '@shared/schemas/search-filters.schema';
import { initContract } from '@ts-rest/core';

const contract = initContract();
export const pageFiltersContract = contract.router({
  searchFilters: {
    method: 'GET',
    path: '/filters',
    query: SearchFiltersSchema,
    responses: {
      200: contract.type<ApiResponse<PageFilter[]>>(),
      400: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
  },
});
