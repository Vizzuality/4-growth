import { WidgetDataFilter } from '@shared/dto/widgets/widget-data-filter';
import { Injectable, Logger } from '@nestjs/common';
import { CountryISO3Map } from '@shared/constants/country-iso3.map';

export type FilterClauseWithParams = [sqlCode: string, queryParams: unknown[]];

@Injectable()
export class SQLAdapter {
  public constructor(private readonly logger: Logger) {}

  public generateFilterClauseForProjections(
    filters?: WidgetDataFilter[],
    opts: { alias?: string; queryParams?: unknown[] } = {},
  ): FilterClauseWithParams {
    opts.queryParams ??= [];
    if (Array.isArray(filters) === false) return ['', opts.queryParams];

    const { alias: rawAlias, queryParams } = opts;
    const alias = rawAlias === undefined ? '' : `${rawAlias}.`;
    let currentParamIdx = queryParams.length;

    let filterClause: string = 'WHERE ';
    for (const filter of filters) {
      // Countries edge case
      if (filter.name == 'country') {
        filterClause += '(';
        for (const filterValue of filter.values) {
          filterClause += `${alias}country_code ${filter.operator} $${++currentParamIdx} OR `;
          queryParams.push(CountryISO3Map.getISO3ByCountryName(filterValue));
        }
        filterClause = filterClause.slice(0, -4);
        filterClause += ') AND ';
        continue;
      }

      filterClause += `(${alias}question_indicator = '${filter.name}' AND (`;

      for (const filterValue of filter.values) {
        filterClause += `${alias}answer ${filter.operator} $${++currentParamIdx} OR `;
        queryParams.push(filterValue);
      }
      filterClause = filterClause.slice(0, -4);
      filterClause += ')) AND ';
    }
    filterClause = filterClause.slice(0, -4);
    return [filterClause, queryParams];
  }

  public generateFilterClauseFromWidgetDataFilters(
    filters?: WidgetDataFilter[],
    opts: { alias?: string; queryParams?: unknown[] } = {},
  ): FilterClauseWithParams {
    opts.queryParams ??= [];
    if (Array.isArray(filters) === false) return ['', opts.queryParams];

    const { alias: rawAlias, queryParams } = opts;
    const alias = rawAlias === undefined ? '' : `${rawAlias}.`;
    let currentParamIdx = queryParams.length;

    let filterClause: string = 'WHERE ';
    for (const filter of filters) {
      // Countries edge case
      if (filter.name == 'location-country-region') {
        filterClause += '(';
        for (const filterValue of filter.values) {
          filterClause += `${alias}country_code ${filter.operator} $${++currentParamIdx} OR `;
          queryParams.push(CountryISO3Map.getISO3ByCountryName(filterValue));
        }
        filterClause = filterClause.slice(0, -4);
        filterClause += ') AND ';
        continue;
      }

      filterClause += `(${alias}question_indicator = '${filter.name}' AND (`;

      for (const filterValue of filter.values) {
        filterClause += `${alias}answer ${filter.operator} $${++currentParamIdx} OR `;
        queryParams.push(filterValue);
      }
      filterClause = filterClause.slice(0, -4);
      filterClause += ')) AND ';
    }
    filterClause = filterClause.slice(0, -4);
    return [filterClause, queryParams];
  }

  public addExpressionToFilterClause(
    filterClauseWithParams: FilterClauseWithParams = ['', []],
    newExpression: [column: string, operator: string, value: unknown],
    alias?: string,
  ): FilterClauseWithParams {
    alias = alias === undefined ? '' : `${alias}.`;

    if (filterClauseWithParams[0] !== '') {
      const sqlCode = `${filterClauseWithParams[0]} AND ${alias}${newExpression[0]} ${newExpression[1]} $${filterClauseWithParams[1].length + 1}`;
      return [sqlCode, [...filterClauseWithParams[1], newExpression[2]]];
    }

    const sqlCode = `WHERE ${alias}${newExpression[0]} ${newExpression[1]} $${filterClauseWithParams[1].length + 1}`;
    return [sqlCode, [...filterClauseWithParams[1], newExpression[2]]];
  }
}
