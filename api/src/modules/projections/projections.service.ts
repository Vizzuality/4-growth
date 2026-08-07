import { Repository, SelectQueryBuilder } from 'typeorm';
import { AppBaseService } from '@api/utils/app-base.service';
import { AppInfoDTO } from '@api/utils/info.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Projection } from '@shared/dto/projections/projection.entity';
import {
  SearchFilterDTO,
  SearchFiltersDTO,
} from '@shared/dto/global/search-filters';
import { FetchSpecification } from 'nestjs-base-service';
import {
  IProjectionDataRepository,
  ProjectionDataRepository,
} from '@api/infrastructure/projection-data-repository.interface';
import { ProjectionFilter } from '@shared/dto/projections/projection-filter.entity';
import { QueryBuilderUtils } from '@api/infrastructure/query-builder-utils';
import { ProjectionWidget } from '@shared/dto/projections/projection-widget.entity';
import {
  CustomProjectionSettingsType,
  generateCustomProjectionSettings,
} from '@shared/dto/projections/custom-projection-settings';
import { CustomProjection } from '@shared/dto/projections/custom-projection.type';
import { CustomProjectionSettingsSchemaType } from '@shared/schemas/custom-projection-settings.schema';
import { NonExportableWidgetError } from '@api/modules/widgets/csv/widget-data.csv';
import { serializeProjectionDataToCsv } from '@api/modules/widgets/csv/projection-data.csv';
import { buildCsvFilename } from '@api/modules/widgets/csv/filename';
@Injectable()
export class ProjectionsService extends AppBaseService<
  Projection,
  unknown,
  unknown,
  AppInfoDTO
> {
  public constructor(
    @InjectRepository(Projection)
    private readonly projectionsRepository: Repository<Projection>,
    @InjectRepository(ProjectionFilter)
    private readonly projectionsFiltersRepository: Repository<ProjectionFilter>,
    @InjectRepository(ProjectionWidget)
    private readonly projectionWidgetsRepository: Repository<ProjectionWidget>,
    @Inject(ProjectionDataRepository)
    private readonly projectionDataRepository: IProjectionDataRepository,
  ) {
    super(projectionsRepository, 'projection', 'projections');
  }

  public async generateCustomProjection(
    query: SearchFiltersDTO & CustomProjectionSettingsSchemaType,
  ): Promise<CustomProjection> {
    const { settings, dataFilters = [], breakdown, othersAggregation } = query;
    return this.projectionDataRepository.previewProjectionCustomWidget(
      dataFilters,
      settings,
      breakdown,
      othersAggregation,
    );
  }

  public async getCustomProjectionSettings(
    query: SearchFiltersDTO,
  ): Promise<CustomProjectionSettingsType> {
    const { filters, dataFilters = [] } = query;
    const colorFilter = filters?.find((f) => f.name === 'color');
    const colorAttribute = colorFilter?.values?.[0] as string | undefined;

    let includeOthersAggregation = true;
    if (colorAttribute) {
      const distinctCount =
        await this.projectionDataRepository.countDistinctColorValues(
          colorAttribute,
          dataFilters,
        );
      includeOthersAggregation = distinctCount > 9;
    } else {
      includeOthersAggregation = false;
    }

    return generateCustomProjectionSettings(query, includeOthersAggregation);
  }

  public async getProjectionsFilters(
    query: FetchSpecification & SearchFiltersDTO,
  ): Promise<ProjectionFilter[]> {
    return this.projectionDataRepository.searchAvailableFilters(query.filters);
  }

  public async getProjectionsWidgets(
    query: FetchSpecification & SearchFiltersDTO,
  ): Promise<ProjectionWidget[]> {
    const { filters, dataFilters = [] } = query;
    const queryBuilder = this.projectionWidgetsRepository
      .createQueryBuilder('projections_widget')
      .addSelect('projection_type.description', 'description')
      .leftJoin(
        'projection_types',
        'projection_type',
        'projections_widget.type::text = projection_type.id::text',
      );

    QueryBuilderUtils.applySearchFilters(
      queryBuilder,
      filters as SearchFilterDTO[],
    );

    const result = await queryBuilder.getRawAndEntities();
    // TODO: This is a workaround to include the description field from projection_types.
    // Due to time constraints this manual mapping works for now.
    const projectionsWidgets = result.entities.map((entity, index) => ({
      ...entity,
      description: result.raw[index]?.description,
    }));

    await this.projectionDataRepository.addDataToProjectionsWidgets(
      projectionsWidgets,
      dataFilters,
    );
    return projectionsWidgets;
  }

  public async extendFindAllQuery(
    query: SelectQueryBuilder<Projection>,
    fetchSpecification: FetchSpecification & SearchFiltersDTO,
  ): Promise<SelectQueryBuilder<Projection>> {
    query
      .innerJoinAndSelect('projection.projectionData', 'projectionData')
      .orderBy('projection.id', 'ASC')
      .addOrderBy('projectionData.year', 'ASC');

    return QueryBuilderUtils.applySearchFilters(
      query,
      fetchSpecification.filters,
      { alias: 'projection' },
    );
  }

  public async exportProjectionWidgetCsv(
    id: number,
    query: SearchFiltersDTO,
    now: Date = new Date(),
  ): Promise<{ csv: string; filename: string }> {
    const widget = await this.projectionWidgetsRepository.findOneBy({ id });
    if (widget === null) {
      throw new NotFoundException(`Projection widget with id ${id} not found`);
    }

    const { dataFilters = [] } = query;
    await this.projectionDataRepository.addDataToProjectionsWidgets(
      [widget],
      dataFilters,
    );

    if (!widget.data || Object.keys(widget.data).length === 0) {
      throw new BadRequestException('Projection widget has no data to export');
    }

    return this.wrapCsv(
      () => serializeProjectionDataToCsv(widget.data),
      widget.title,
      now,
    );
  }

  public async exportCustomProjectionCsv(
    query: SearchFiltersDTO & CustomProjectionSettingsSchemaType,
    now: Date = new Date(),
  ): Promise<{ csv: string; filename: string }> {
    const projection = await this.generateCustomProjection(query);
    return this.wrapCsv(
      () => serializeProjectionDataToCsv(projection),
      'custom-projection',
      now,
    );
  }

  private wrapCsv(
    serialize: () => string,
    titleForFilename: string,
    now: Date,
  ): { csv: string; filename: string } {
    try {
      const csv = serialize();
      const filename = buildCsvFilename(titleForFilename, now);
      return { csv, filename };
    } catch (error) {
      if (error instanceof NonExportableWidgetError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
