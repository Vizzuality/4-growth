import {
  WIDGET_VISUALIZATIONS,
  WidgetVisualizationsType,
} from '@shared/dto/widgets/widget-visualizations.constants';
import { DataSource, EntityManager } from 'typeorm';
import { ISurveyDataRepository } from '@api/infrastructure/survey-data-repository.interface';
import { Inject, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { WidgetDataFilters } from '@shared/dto/widgets/widget-data-filter';
import { SectionWithDataWidget } from '@shared/dto/sections/section.entity';
import { SQLAdapter } from '@api/infrastructure/sql-adapter';
import { WidgetQuestionMap } from '@shared/dto/widgets/widget-question-map';
import {
  BaseWidgetWithData,
  WidgetChartData,
  WidgetData,
} from '@shared/dto/widgets/base-widget-data.interface';

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
    // Perform a transaction to ensure isolation
    return await this.dataSource.transaction('READ COMMITTED', async (t) => {
      let answersTable: string = 'survey.answers';

      if (filters !== undefined) {
        answersTable = `filtered_answers`;

        const filterClause =
          this.sqlAdapter.generateSqlFromWidgetDataFilters(filters);

        await t.query(`CREATE TEMPORARY TABLE ${answersTable} ON COMMIT DROP AS
SELECT * FROM survey.answers WHERE survey_id IN (SELECT survey_id FROM survey.answers ${filterClause})`);
      }

      // Only the first section is needed for now
      const widgetDataPromises = [];
      for (let sectionIdx = 0; sectionIdx < sections.length; sectionIdx++) {
        const section = sections[sectionIdx];
        const baseWidgets = section.baseWidgets;
        for (let widgetIdx = 0; widgetIdx < baseWidgets.length; widgetIdx++) {
          const widget = baseWidgets[widgetIdx];
          widgetDataPromises.push(
            this.appendBaseWidgetData(t, answersTable, widget),
          );
        }
      }

      await Promise.all(widgetDataPromises);
      return sections;
    });
  }

  private async appendBaseWidgetData(
    t: EntityManager,
    answersTable: string,
    widget: BaseWidgetWithData,
  ): Promise<void> {
    const question = WidgetQuestionMap.getQuestionByWidgetIndicator(
      widget.indicator,
    );
    if (question === undefined) {
      this.logger.warn(
        `${widget.indicator} not found in WidgetQuestionMap. Skipping filter...`,
        this.constructor.name,
      );
      widget.data = {};
    }
    // TODO: Edge cases here. Total surveys and total countries.
    if (widget.indicator === 'Total surveys') {
      const filteredCount = `SELECT COUNT(count)::integer as count FROM (SELECT COUNT(DISTINCT survey_id) FROM ${answersTable} GROUP BY survey_id) AS survey_count`;
      const totalCount = `SELECT COUNT(count)::integer as count FROM (SELECT COUNT(DISTINCT survey_id) FROM survey.answers GROUP BY survey_id) AS survey_count`;
      const [[{ count: value }], [{ count: total }]] = await Promise.all([
        t.query(filteredCount),
        t.query(totalCount),
      ]);
      widget.data = { counter: { value, total } };
      return;
    }
    if (widget.indicator === 'Total countries') {
      const filteredCount = `SELECT COUNT(DISTINCT categorical_answer) as "count" FROM ${answersTable} WHERE hierarchy_level_2 = '${question}'`;
      const totalCount = `SELECT COUNT(DISTINCT categorical_answer) as "count" FROM survey.answers WHERE hierarchy_level_2 = '${question}'`;
      const [[{ count: value }], [{ count: total }]] = await Promise.all([
        t.query(filteredCount),
        t.query(totalCount),
      ]);
      widget.data = { counter: { value, total } };
      return;
    }

    const totalsSql = `SELECT categorical_answer as "key", count(categorical_answer)::integer as "count", SUM(COUNT(categorical_answer)) OVER ()::integer AS total FROM ${answersTable} WHERE hierarchy_level_2 = '${question}' GROUP BY categorical_answer`;
    const totalsResult: { key: string; count: number; total: number }[] =
      await t.query(totalsSql);

    if (totalsResult.length === 0) {
      widget.data = {};
      return;
    }

    let widgetData: WidgetData = {};
    const charts: WidgetVisualizationsType[] = [
      WIDGET_VISUALIZATIONS.AREA_GRAPH,
      WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART,
      WIDGET_VISUALIZATIONS.PIE_CHART,
    ];

    if (widget.visualisations.some((v) => charts.includes(v))) {
      const arr: WidgetChartData = [];

      for (let rowIdx = 0; rowIdx < totalsResult.length; rowIdx++) {
        const res = totalsResult[rowIdx];
        arr.push({ label: res.key, value: res.count });
      }

      widgetData = { chart: arr };
    }

    if (widget.visualisations.includes(WIDGET_VISUALIZATIONS.SINGLE_VALUE)) {
      // TODO: Add WidgetCounterData
    }

    if (widget.visualisations.includes(WIDGET_VISUALIZATIONS.MAP)) {
      // TODO: Add WidgetMapData
    }

    if (widget.visualisations.includes(WIDGET_VISUALIZATIONS.NAVIGATION)) {
      // TODO: Add WidgetNavigationData
    }

    widget.data = widgetData;
  }
}
