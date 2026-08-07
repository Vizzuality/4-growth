import { JSONAPIError } from '@shared/dto/errors/json-api.error';
import { ApiResponse } from '@shared/dto/global/api-response.dto';
import { CustomProjectionSettingsType } from '@shared/dto/projections/custom-projection-settings';
import { CustomProjection } from '@shared/dto/projections/custom-projection.type';
import { ProjectionFilter } from '@shared/dto/projections/projection-filter.entity';
import { ProjectionWidget } from '@shared/dto/projections/projection-widget.entity';
import { CustomProjectionSettingsSchema } from '@shared/schemas/custom-projection-settings.schema';
import { generateEntityQuerySchema } from '@shared/schemas/query-param.schema';
import { SearchFiltersSchema } from '@shared/schemas/search-filters.schema';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const contract = initContract();

const CsvResponse = contract.otherResponse({
  contentType: 'text/csv; charset=utf-8',
  body: z.string(),
});

export const projectionsContract = contract.router({
  getProjectionsFilters: {
    method: 'GET',
    path: '/projections/filters',
    query:
      generateEntityQuerySchema(ProjectionFilter).merge(SearchFiltersSchema),
    responses: {
      200: contract.type<ApiResponse<ProjectionFilter[]>>(),
      400: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
  },
  getProjectionsWidgets: {
    method: 'GET',
    path: '/projections/widgets',
    query:
      generateEntityQuerySchema(ProjectionWidget).merge(SearchFiltersSchema),
    responses: {
      200: contract.type<ApiResponse<ProjectionWidget[]>>(),
      400: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
  },
  getCustomProjectionSettings: {
    method: 'GET',
    path: '/projections/custom-widget/settings',
    query:
      generateEntityQuerySchema(ProjectionWidget).merge(SearchFiltersSchema),
    responses: {
      200: contract.type<ApiResponse<CustomProjectionSettingsType>>(),
      400: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
  },
  getCustomProjection: {
    method: 'GET',
    path: '/projections/custom-widget',
    query: SearchFiltersSchema.merge(CustomProjectionSettingsSchema),
    responses: {
      200: contract.type<ApiResponse<CustomProjection>>(),
      400: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
  },
  exportProjectionWidget: {
    method: 'GET',
    path: '/projections/widgets/:id/export',
    pathParams: z.object({ id: z.coerce.number() }),
    query: SearchFiltersSchema,
    responses: {
      200: CsvResponse,
      400: contract.type<JSONAPIError>(),
      404: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
    summary: "Download a projection widget's data as a CSV file",
  },
  exportCustomProjection: {
    method: 'GET',
    path: '/projections/custom-widget/export',
    query: SearchFiltersSchema.merge(CustomProjectionSettingsSchema),
    responses: {
      200: CsvResponse,
      400: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
    summary: "Download a custom projection's data as a CSV file",
  },
});
