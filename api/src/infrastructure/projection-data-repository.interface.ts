import { SearchFilterDTO } from '@shared/dto/global/search-filters';
import { CustomProjection } from '@shared/dto/projections/custom-projection.type';
import { ProjectionData } from '@shared/dto/projections/projection-data.entity';
import { ProjectionFilter } from '@shared/dto/projections/projection-filter.entity';
import { ProjectionWidget } from '@shared/dto/projections/projection-widget.entity';
import { ProjectionRatioConfig } from '@shared/dto/projections/projection-types';
import {
  CustomProjectionSettingsType,
  OthersAggregationType,
} from '@shared/schemas/custom-projection-settings.schema';
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
  findProjectionWidgetData(dataFilters: SearchFilterDTO[], ratioConfig?: ProjectionRatioConfig): Promise<any>;
  countDistinctColorValues(
    colorFieldName: string,
    dataFilters: SearchFilterDTO[],
  ): Promise<number>;
  findProjectionTableData(
    dataFilters: SearchFilterDTO[],
    indicator: string,
  ): Promise<CustomProjection>;
  previewProjectionCustomWidget(
    dataFilters: SearchFilterDTO[],
    settings: CustomProjectionSettingsType,
    breakdown?: string,
    othersAggregation?: OthersAggregationType,
  ): Promise<CustomProjection>;
}
