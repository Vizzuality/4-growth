import { Repository, SelectQueryBuilder } from 'typeorm';
import { AppBaseService } from '@api/utils/app-base.service';
import { AppInfoDTO } from '@api/utils/info.dto';
import { Inject, Injectable } from '@nestjs/common';
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
    const { settings, dataFilters = [] } = query;
    return this.projectionDataRepository.previewProjectionCustomWidget(
      dataFilters,
      settings,
    );
  }

  public getCustomProjectionSettings(
    query: SearchFiltersDTO,
  ): CustomProjectionSettingsType {
    return generateCustomProjectionSettings(query);
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
    const queryBuilder = this.projectionWidgetsRepository.createQueryBuilder();
    QueryBuilderUtils.applySearchFilters(
      queryBuilder,
      filters as SearchFilterDTO[],
    );

    const projectionsWidgets = await queryBuilder.getMany();
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
}
