import { WidgetDataFilters } from '@shared/dto/widgets/widget-data-filter';
import { PageFilterQuestionMap } from '../../../shared/dto/widgets/page-filter-question-map';
import { Injectable, Logger } from '@nestjs/common';
import { Section } from '@shared/dto/sections/section.entity';

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

  public generateSqlFromWidgetDataFilters(filters: WidgetDataFilters): string {
    let filterClause: string = 'WHERE ';
    for (const filter of filters) {
      const columnValues = PageFilterQuestionMap.getColumnValueByFilterName(
        filter.name,
      );
      if (columnValues === undefined) {
        this.logger.warn(
          `${filter.name} not found in PageFilterQuestionMap. Skipping filter...`,
          this.constructor.name,
        );
        continue;
      }
      for (const value of columnValues) {
        filterClause += `(hierarchy_level_2 = '${value}' AND (`;

        for (const filterValue of filter.values) {
          filterClause += `categorical_answer ${filter.operator} '${filterValue}' OR `;
        }
        filterClause = filterClause.slice(0, -4);
        filterClause += ')) AND ';
      }
    }
    filterClause = filterClause.slice(0, -4);
    return filterClause;
  }
}
