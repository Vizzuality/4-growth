import { WidgetDataFilter } from '@shared/dto/widgets/widget-data-filter';
import { Injectable, Logger } from '@nestjs/common';
import { Section } from '@shared/dto/sections/section.entity';
import { CountryISO3Map } from '@shared/constants/country-iso3.map';

@Injectable()
export class SQLAdapter {
  public constructor(private readonly logger: Logger) {}

  public generateSqlFromPageFilters(
    pageFilters: { name: string; values: string[] }[],
  ) {
    let sqlCode: string = '';
    for (let idx = 0; idx < pageFilters.length; idx++) {
      const pageFilter = pageFilters[idx];
      // eslint-disable-next-line prettier/prettier
      sqlCode += `INSERT INTO page_filters (name, values) VALUES ('${pageFilter.name.replace(/'/g, "''")}', '${pageFilter.values.join(';').replace(/'/g, "''")}') ON CONFLICT (name) DO UPDATE SET values = excluded.values;\n`;
    }
    return sqlCode;
  }

  public generateSqlFromSections(sections: Section[]) {
    let sqlCode: string = '';
    for (const section of sections) {
      const { order, slug, name, description, baseWidgets } = section;

      let widgetsSql = '';
      for (const widget of baseWidgets) {
        const {
          question,
          indicator,
          defaultVisualization,
          visualisations,
          sectionOrder,
        } = widget;
        widgetsSql += `{"indicator": "${indicator}", "question": "${question}", "default_visualization": "${defaultVisualization}", "visualizations": "${visualisations}", "section_order": ${sectionOrder}},`;
      }
      widgetsSql = widgetsSql.slice(0, -1);
      sqlCode += `SELECT upsert_section_with_widgets('{"order": ${order}, "slug": "${slug}", "name": "${name}", "description": "${description}"}','[${widgetsSql}]'::jsonb);\n`;
    }

    return sqlCode;
  }

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
