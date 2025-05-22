import { SearchFilterDTO } from '@shared/dto/global/search-filters';
import { ProjectionData } from '@shared/dto/projections/projection-data.entity';
import { ProjectionFilter } from '@shared/dto/projections/projection-filter.entity';
import { ProjectionWidget } from '@shared/dto/projections/projection-widget.entity';
import { Repository } from 'typeorm';

export const ProjectionDataRepository = Symbol('IProjectionDataRepository');

export interface IProjectionDataRepository extends Repository<ProjectionData> {
  searchAvailableFilters(
    filters: SearchFilterDTO[],
  ): Promise<ProjectionFilter[]>;
  addDataToProjectionsWidgets(
    projectionWidgets: ProjectionWidget[],
    dataFilters: SearchFilterDTO[],
  ): Promise<void>;
}
