import { DataSource } from 'typeorm';
import { ISurveyDataRepository } from '@api/infrastructure/survey-data-repository.interface';
import { Inject, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { WidgetDataFilters } from '@shared/dto/widgets/widget-data-filter';
import { SectionWithDataWidget } from '@shared/dto/sections/section.entity';
import { SQLAdapter } from '@api/infrastructure/sql-adapter';
import {
  BaseWidgetWithData,
  WidgetChartData,
  WidgetData,
} from '@shared/dto/widgets/base-widget-data.interface';
import { WidgetUtils } from '@shared/dto/widgets/widget.utils';

export class PostgresSurveyDataRepository implements ISurveyDataRepository {
  public constructor(
    private readonly logger: Logger,
    @Inject(SQLAdapter) private readonly sqlAdapter: SQLAdapter,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  public async addSurveyDataToSections(
    sections: SectionWithDataWidget[],
    filters?: WidgetDataFilters,
  ): Promise<SectionWithDataWidget[]> {
    const answersTable: string = 'survey_answers';
    let filterClause: string;

    if (filters !== undefined) {
      filterClause = this.sqlAdapter.generateSqlFromWidgetDataFilters(filters);
    }

    const widgetDataPromises = [];
    for (let sectionIdx = 0; sectionIdx < sections.length; sectionIdx++) {
      const section = sections[sectionIdx];
      const baseWidgets = section.baseWidgets;
      for (let widgetIdx = 0; widgetIdx < baseWidgets.length; widgetIdx++) {
        const widget = baseWidgets[widgetIdx];
        widgetDataPromises.push(
          this.appendBaseWidgetData(answersTable, filterClause, widget),
        );
      }
    }

    await Promise.all(widgetDataPromises);
    return sections;
  }

  private async appendBaseWidgetData(
    answersTable: string,
    filterClause: string,
    widget: BaseWidgetWithData,
  ): Promise<void> {
    const { indicator } = widget;
    // Edge cases here. Total surveys and total countries.
    if (indicator === 'total-surveys') {
      const filteredCount = `SELECT COUNT(count)::integer as count FROM (SELECT COUNT(DISTINCT survey_id) FROM ${answersTable} ${filterClause} GROUP BY survey_id) AS survey_count`;
      const totalCount = `SELECT COUNT(count)::integer as count FROM (SELECT COUNT(DISTINCT survey_id) FROM ${answersTable} GROUP BY survey_id) AS survey_count`;
      const [[{ count: value }], [{ count: total }]] = await Promise.all([
        this.dataSource.query(filteredCount),
        this.dataSource.query(totalCount),
      ]);
      widget.data = { counter: { value, total } };
      return;
    }
    if (indicator === 'total-countries') {
      const filteredCount = `SELECT COUNT(DISTINCT country_code)::integer as "count" FROM ${answersTable} ${filterClause}`;
      const totalCount = `SELECT COUNT(DISTINCT country_code)::integer as "count" FROM ${answersTable};`;
      const [[{ count: value }], [{ count: total }]] = await Promise.all([
        this.dataSource.query(filteredCount),
        this.dataSource.query(totalCount),
      ]);
      widget.data = { counter: { value, total } };
      return;
    }

    const totalsSql = `SELECT answer as "key", count(answer)::integer as "count", SUM(COUNT(answer)) OVER ()::integer AS total FROM ${answersTable} ${this.sqlAdapter.appendExpressionToFilterClause(filterClause, `question_indicator = '${indicator}'`)} GROUP BY answer`;
    const totalsResult: { key: string; count: number; total: number }[] =
      await this.dataSource.query(totalsSql);

    if (totalsResult.length === 0) {
      widget.data = {};
      return;
    }

    const widgetData: WidgetData = {};
    const {
      supportsChart,
      supportsSingleValue,
      supportsMap,
      supportsNavigation,
    } = WidgetUtils.getSupportedVisualizations(widget);

    if (supportsChart) {
      const arr: WidgetChartData = [];

      for (let rowIdx = 0; rowIdx < totalsResult.length; rowIdx++) {
        const res = totalsResult[rowIdx];
        arr.push({ label: res.key, value: res.count, total: res.total });
      }

      widgetData.chart = arr;
    }

    if (supportsSingleValue) {
      // TODO: Add WidgetCounterData
    }

    if (supportsMap) {
      // TODO: Add WidgetMapData
    }

    if (supportsNavigation) {
      // TODO: Add WidgetNavigationData
    }

    widget.data = widgetData;
  }
}
