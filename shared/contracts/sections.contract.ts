import { JSONAPIError } from '@shared/dto/errors/json-api.error';
import { ApiPaginationResponse } from '@shared/dto/global/api-response.dto';
import { Section } from '@shared/dto/sections/section.entity';
import { initContract } from '@ts-rest/core';
import { FetchSpecification } from 'nestjs-base-service';

const contract = initContract();
export const sectionContract = contract.router({
  searchSections: {
    method: 'GET',
    path: '/sections',
    query: contract.type<FetchSpecification>(),
    responses: {
      200: contract.type<ApiPaginationResponse<Section>>(),
      400: contract.type<JSONAPIError>(),
    },
  },
});
