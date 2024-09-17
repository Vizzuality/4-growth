import { JSONAPIError } from '@shared/dto/errors/json-api.error';
import { ApiPaginationResponse } from '@shared/dto/global/api-response.dto';
import { Section } from '@shared/dto/sections/section.entity';
import { initContract } from '@ts-rest/core';
import { FetchSpecificationSchema } from '@shared/schemas/query-param.schema';

const contract = initContract();
export const sectionContract = contract.router({
  searchSections: {
    method: 'GET',
    path: '/sections',
    query: FetchSpecificationSchema,
    responses: {
      200: contract.type<ApiPaginationResponse<Section>>(),
      400: contract.type<JSONAPIError>(),
    },
  },
});
