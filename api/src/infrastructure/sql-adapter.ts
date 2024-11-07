import { WidgetDataFilter } from '@shared/dto/widgets/widget-data-filter';
import { Injectable, Logger } from '@nestjs/common';
import { CountryISO3Map } from '@shared/constants/country-iso3.map';

@Injectable()
export class SQLAdapter {
  public constructor(private readonly logger: Logger) {}

  public generateSqlFromWidgetDataFilters(
    filters?: WidgetDataFilter[],
    alias?: string,
  ): string {
    if (Array.isArray(filters) === false) return '';

    let filterClause: string = 'WHERE ';
    for (const filter of filters) {
      // Countries
      if (filter.name == 'location-country-region') {
        filterClause += '(';
        for (const filterValue of filter.values) {
          filterClause += `${alias === undefined ? '' : `${alias}.`}country_code ${filter.operator} '${CountryISO3Map.getISO3ByCountryName(filterValue)}' OR `;
        }
        filterClause = filterClause.slice(0, -4);
        filterClause += ') AND ';
        continue;
      }

      filterClause += `(${alias === undefined ? '' : `${alias}.`}question_indicator = '${filter.name}' AND (`;

      for (const filterValue of filter.values) {
        filterClause += `${alias === undefined ? '' : `${alias}.`}answer ${filter.operator} '${filterValue}' OR `;
      }
      filterClause = filterClause.slice(0, -4);
      filterClause += ')) AND ';
    }
    filterClause = filterClause.slice(0, -4);
    return filterClause;
  }

  public appendExpressionToFilterClause(
    filterClause: string,
    newExpression: string,
    alias?: string,
  ): string {
    if (filterClause !== '') {
      return `${filterClause} AND ${alias === undefined ? newExpression : `${alias}.${newExpression}`}`;
    }
    return `WHERE ${alias === undefined ? newExpression : `${alias}.${newExpression}`}`;
  }
}
