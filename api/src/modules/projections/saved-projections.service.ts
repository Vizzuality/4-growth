import { AppBaseService } from '@api/utils/app-base.service';
import { AppInfoDTO } from '@api/utils/info.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiPaginationResponse } from '@shared/dto/global/api-response.dto';
import { SavedProjection } from '@shared/dto/projections/saved-projection.entity';
import {
  CreateSavedProjectionDTO,
  UpdateSavedProjectionDTO,
} from '@shared/dto/projections/saved-projection.dto';
import { FetchSpecification } from 'nestjs-base-service';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class SavedProjectionService extends AppBaseService<
  SavedProjection,
  CreateSavedProjectionDTO,
  UpdateSavedProjectionDTO,
  AppInfoDTO
> {
  public constructor(
    protected readonly logger: Logger,
    @InjectRepository(SavedProjection)
    private savedProjectionRepository: Repository<SavedProjection>,
  ) {
    super(savedProjectionRepository, 'saved-projection', 'saved-projections');
  }

  public async searchSavedProjections(
    userId: string,
    fetchSpecification: FetchSpecification,
  ): Promise<ApiPaginationResponse<SavedProjection>> {
    return this.findAllPaginated(fetchSpecification, { userId });
  }

  public async extendFindAllQuery(
    query: SelectQueryBuilder<SavedProjection>,
    fetchSpecification: Record<string, unknown>,
  ) {
    if (fetchSpecification.userId) {
      query.where(`${this.alias}.user.id = :userId`, {
        userId: fetchSpecification.userId,
      });
    }
    return query;
  }

  public async findSavedProjectionById(
    userId: string,
    id: number,
  ): Promise<SavedProjection> {
    const savedProjection = await this.savedProjectionRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
    });

    if (savedProjection === null) {
      throw new NotFoundException('SavedProjection not found');
    }
    return savedProjection;
  }

  public async createSavedProjection(
    userId: string,
    params: CreateSavedProjectionDTO,
  ): Promise<SavedProjection> {
    const savedProjection: DeepPartial<SavedProjection> = {
      name: params.name,
      user: { id: userId },
      settings: params.settings,
      dataFilters: params.dataFilters,
    };
    return this.savedProjectionRepository.save(savedProjection);
  }

  public async updateSavedProjection(
    userId: string,
    id: number,
    params: UpdateSavedProjectionDTO,
  ): Promise<SavedProjection> {
    const savedProjection = await this.savedProjectionRepository.findOneBy({
      id,
      user: { id: userId },
    });
    if (savedProjection === null) {
      const exception = new NotFoundException('SavedProjection not found');
      this.logger.error(
        `SavedProjection with id ${id} not found`,
        null,
        exception.stack,
      );
      throw exception;
    }

    if (params.name !== undefined) {
      savedProjection.name = params.name;
    }
    if (params.settings !== undefined) {
      savedProjection.settings = params.settings;
    }
    if (params.dataFilters !== undefined) {
      savedProjection.dataFilters = params.dataFilters;
    }

    return this.savedProjectionRepository.save(savedProjection);
  }

  public async deleteSavedProjection(
    userId: string,
    id: number,
    info?: AppInfoDTO,
  ) {
    const result = await this.savedProjectionRepository.delete({
      id,
      user: { id: userId },
    });

    if (result.affected === 0) {
      const exception = new NotFoundException('SavedProjection not found');
      this.logger.error(
        `SavedProjection with id ${id} for user ${info?.authenticatedUser?.id} not found`,
        null,
        exception.stack,
      );
      throw exception;
    }
  }
}
