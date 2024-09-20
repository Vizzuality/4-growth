import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SectionsCSVParser } from 'api/data/sections-csv-parser';
import { Section } from '@shared/dto/sections/section.entity';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';

@Injectable()
export class DataSourceManager {
  private readonly logger: Logger;

  public constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  public async loadInitialData(): Promise<void> {
    const filePath = `data/survey.csv`;
    this.logger.log(`Loading initial data from "${filePath}"`);

    const sections = await SectionsCSVParser.parseSectionsFromFile(filePath, {
      delimiter: ';',
    });

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      // Does not work even with cascade or deleteOrphanedRows
      // await queryRunner.manager.getRepository(Section).save(sections);

      const baseWidgetRepository =
        queryRunner.manager.getTreeRepository(BaseWidget);
      for (const section of sections) {
        await queryRunner.manager.getRepository(Section).save(section);
        const sectionWidgetIds = section.baseWidgets.map((w) => w.id);

        // await queryRunner.query(
        //   'DELETE FROM base_widgets WHERE section_id = $1 AND id NOT IN (SELECT UNNEST($2::integer[]))',
        //   [section.order, sectionWidgetIds],
        // );
        for (const widget of section.baseWidgets) {
          // Not working even if i create instance of BaseWidget
          // const widgetInstance = baseWidgetRepository.create(widget);
          // await baseWidgetRepository.save(widgetInstance);

          const foundWidget = await baseWidgetRepository.findOneBy({
            id: widget.id,
          });
          if (foundWidget == null) {
            await baseWidgetRepository.save(widget);
            continue;
          }

          foundWidget.indicator = widget.indicator;
          foundWidget.question = widget.question;
          foundWidget.section = widget.section.order as any;
          foundWidget.sectionOrder = widget.sectionOrder;
          await baseWidgetRepository.save(foundWidget);
        }
        break;
      }
      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_section_widgets_section_order ON "base_widgets" (section_order ASC)',
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
