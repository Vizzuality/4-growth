// src/utils/query-builder-utils.ts
import { CountryISO3Map } from '@shared/constants/country-iso3.map';
import {
  SEARCH_FILTERS_OPERATORS,
  SearchFilterDTO,
} from '@shared/dto/global/search-filters';
import { SelectQueryBuilder } from 'typeorm';

export const QueryBuilderUtils = {
  applySearchFilters<T>(
    query: SelectQueryBuilder<T>,
    filters: SearchFilterDTO[] = [],
    params: {
      alias?: string;
      filterNameToFieldNameMap?: { [key: string]: string };
    } = {},
  ): SelectQueryBuilder<T> {
    const { alias, filterNameToFieldNameMap } = params;
    for (let idx = 0; idx < filters.length; idx++) {
      const filter = filters[idx];

      const fieldName =
        filterNameToFieldNameMap === undefined
          ? filter.name
          : filterNameToFieldNameMap[filter.name];

      if (fieldName === 'country') {
        filter.values = filter.values.map(
          (value) => CountryISO3Map.getISO3ByCountryName(value) ?? value,
        );
      }
      const column = alias ? `${alias}.${fieldName}` : fieldName;
      const paramKey = `filter_${idx}`;
      switch (filter.operator) {
        case SEARCH_FILTERS_OPERATORS.EQUALS:
          query.andWhere(`${column} = :${paramKey}`, {
            [paramKey]: filter.values[0],
          });
          break;
        case SEARCH_FILTERS_OPERATORS.NOT_EQUALS:
          query.andWhere(`${column} != :${paramKey}`, {
            [paramKey]: filter.values[0],
          });
          break;
        case SEARCH_FILTERS_OPERATORS.IN:
          query.andWhere(`${column} IN (:...${paramKey})`, {
            [paramKey]: filter.values,
          });
          break;
        case SEARCH_FILTERS_OPERATORS.NOT_IN:
          query.andWhere(`${column} NOT IN (:...${paramKey})`, {
            [paramKey]: filter.values,
          });
          break;
      }
    }

    return query;
  },
};
