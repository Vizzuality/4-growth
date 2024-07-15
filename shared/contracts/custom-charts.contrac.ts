import { initContract } from '@ts-rest/core';
import { JSONAPIError } from '@shared/dto/errors/json-api.error';
import { FetchSpecification } from 'nestjs-base-service';
import { CustomChart } from '@shared/dto/custom-charts/custom-chart.entity';
import {
  ApiPaginationResponse,
  ApiResponse,
} from '@shared/dto/global/api-response.dto';
import { UpdateCustomChartDto } from '@shared/dto/custom-charts/update-custom-chart.dto';

const contract = initContract();
export const customChartsContract = contract.router({
  getCustomCharts: {
    method: 'GET',
    path: '/custom-charts',
    query: contract.type<FetchSpecification>(),
    pathParams: contract.type<{ id: string }>(),
    responses: {
      200: contract.type<ApiPaginationResponse<CustomChart>>(),
      201: contract.type<{ test: string }>(),
      400: contract.type<JSONAPIError>(),
    },
  },
  getCustomChart: {
    method: 'GET',
    path: '/custom-charts/:id',
    pathParams: contract.type<{ id: string }>(),
    responses: {
      200: contract.type<ApiResponse<CustomChart>>(),
      400: contract.type<JSONAPIError>(),
    },
  },
  updateCustomChart: {
    method: 'PATCH',
    path: '/custom-charts/:id',
    pathParams: contract.type<{ id: string }>(),
    body: contract.type<UpdateCustomChartDto>(),
    responses: {
      200: contract.type<ApiResponse<CustomChart>>(),
      400: contract.type<JSONAPIError>(),
    },
  },
  deleteCustomChart: {
    method: 'DELETE',
    path: '/custom-charts/:id',
    pathParams: contract.type<{ id: string }>(),
    body: null,
    responses: {
      201: contract.type<null>(),
      400: contract.type<JSONAPIError>(),
    },
  },
});
