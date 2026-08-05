import { WidgetDataFilter } from '@shared/dto/widgets/widget-data-filter';
import { Injectable, Logger } from '@nestjs/common';
import { CountryISOMap } from '@shared/constants/country-iso.map';
import { DATA_SOURCE_FILTER_NAME } from '@shared/constants/page-filters';

export type FilterClauseWithParams = [sqlCode: string, queryParams: unknown[]];

@Injectable()
export class SQLAdapter {
  public constructor(private readonly logger: Logger) {}

  public generateFilterClauseForProjections(
    filters?: WidgetDataFilter[],
    opts: { alias?: string; queryParams?: unknown[] } = {},
  ): FilterClauseWithParams {
    opts.queryParams ??= [];
    if (Array.isArray(filters) === false || filters.length === 0)
      return ['', opts.queryParams];

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
          queryParams.push(CountryISOMap.getISO3ByCountryName(filterValue));
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
    if (Array.isArray(filters) === false || filters.length === 0)
      return ['', opts.queryParams];

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
          queryParams.push(CountryISOMap.getISO3ByCountryName(filterValue));
        }
        filterClause = filterClause.slice(0, -4);
        filterClause += ') AND ';
        continue;
      }

      // data-source edge case — maps to the data_source column, not a question/answer pair
      if (filter.name === DATA_SOURCE_FILTER_NAME) {
        filterClause += '(';
        for (const filterValue of filter.values) {
          filterClause += `${alias}data_source ${filter.operator} $${++currentParamIdx} OR `;
          queryParams.push(filterValue);
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

  public generateFilterClauseForMapWidget(
    filters?: WidgetDataFilter[],
    opts: { alias?: string; queryParams?: unknown[] } = {},
  ): FilterClauseWithParams {
    opts.queryParams ??= [];
    if (Array.isArray(filters) === false || filters.length === 0)
      return ['', opts.queryParams];

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
          queryParams.push(CountryISOMap.getISO3ByCountryName(filterValue));
        }
        filterClause = filterClause.slice(0, -4);
        filterClause += ') AND ';
        continue;
      }

      // data-source edge case — maps to the data_source column (hyphen not valid in SQL identifier)
      if (filter.name === DATA_SOURCE_FILTER_NAME) {
        filterClause += '(';
        for (const filterValue of filter.values) {
          filterClause += `${alias}data_source ${filter.operator} $${++currentParamIdx} OR `;
          queryParams.push(filterValue);
        }
        filterClause = filterClause.slice(0, -4);
        filterClause += ') AND ';
        continue;
      }

      filterClause += '(';
      for (const filterValue of filter.values) {
        filterClause += `${alias}${filter.name} ${filter.operator} $${++currentParamIdx} OR `;
        queryParams.push(filterValue);
      }
      filterClause = filterClause.slice(0, -4);
      filterClause += ') AND ';
    }
    filterClause = filterClause.slice(0, -4);
    return [filterClause, queryParams];
  }

  /**
   * Same as generateFilterClauseFromWidgetDataFilters but without the leading
   * WHERE, for composing into an existing clause. Returns '' when there is
   * nothing to filter on.
   */
  public generatePredicateFromWidgetDataFilters(
    filters?: WidgetDataFilter[],
    opts: { alias?: string; queryParams?: unknown[] } = {},
  ): FilterClauseWithParams {
    const [clause, queryParams] =
      this.generateFilterClauseFromWidgetDataFilters(filters, opts);
    return [clause.replace(/^WHERE /, ''), queryParams];
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
