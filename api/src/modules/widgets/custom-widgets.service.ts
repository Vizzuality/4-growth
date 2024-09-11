import { AppBaseService } from '@api/utils/app-base.service';
import { AppInfoDTO } from '@api/utils/info.dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiPaginationResponse } from '@shared/dto/global/api-response.dto';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { CustomWidget } from '@shared/dto/widgets/custom-widget.entity';
import {
  CreateCustomWidgetDTO,
  UpdateCustomWidgetDTO,
} from '@shared/dto/widgets/widget.dto';
import { FetchSpecification } from 'nestjs-base-service';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { WidgetUtils } from '@shared/dto/widgets/widget.utils';

@Injectable()
export class CustomWidgetService extends AppBaseService<
  CustomWidget,
  CreateCustomWidgetDTO,
  UpdateCustomWidgetDTO,
  AppInfoDTO
> {
  public constructor(
    @InjectRepository(CustomWidget)
    private customWidgetRepository: Repository<CustomWidget>,
    @InjectRepository(BaseWidget)
    private baseWidgetRepository: Repository<BaseWidget>,
  ) {
    super(customWidgetRepository, 'custom-widget', 'custom-widgets');
  }

  public async searchCustomWidgets(
    userId: string,
    fetchSpecification: FetchSpecification,
    info: AppInfoDTO,
  ): Promise<ApiPaginationResponse<CustomWidget>> {
    if (userId !== info.authenticatedUser.id) {
      throw new ForbiddenException();
    }

    return this.findAllPaginated(fetchSpecification, { userId });
  }

  public async extendFindAllQuery(
    query: SelectQueryBuilder<CustomWidget>,
    fetchSpecification: Record<string, unknown>,
  ) {
    if (fetchSpecification.userId) {
      query.where(`${this.alias}.user.id = :userId`, {
        userId: fetchSpecification.userId,
      });
    }
    return query;
  }

  public async findCustomWidgetById(
    userId: string,
    id: number,
    info: AppInfoDTO,
  ): Promise<CustomWidget> {
    if (userId !== info.authenticatedUser.id) {
      throw new ForbiddenException();
    }

    const customWidget = await this.customWidgetRepository.findOneBy({
      id,
      user: { id: userId },
    });

    if (customWidget === null) {
      throw new NotFoundException('CustomWidget not found');
    }
    return customWidget;
  }

  public async createCustomWidget(
    userId: string,
    params: CreateCustomWidgetDTO,
    info: AppInfoDTO,
  ): Promise<CustomWidget> {
    if (userId !== info.authenticatedUser.id) {
      throw new ForbiddenException();
    }

    const baseWidget = await this.baseWidgetRepository.findOneBy({
      id: params.widgetId,
    });
    if (baseWidget === null) {
      const exception = new NotFoundException('BaseWidget not found');
      this.logger.error(
        `BaseWidget with id ${params.widgetId} not found`,
        exception.stack,
      );
      throw exception;
    }

    if (
      WidgetUtils.isValidDefaultVisualization(
        params.defaultVisualization,
        baseWidget.visualisations,
      ) === false
    ) {
      throw new BadRequestException(
        `Visualization ${
          params.defaultVisualization
        } is not allowed. Must be one of: ${baseWidget.visualisations.join(
          ', ',
        )}`,
      );
    }

    const customWidget: DeepPartial<CustomWidget> = {
      name: params.name,
      widget: { id: params.widgetId },
      user: { id: info.authenticatedUser.id },
      filters: params.filters,
      defaultVisualization: params.defaultVisualization,
    };
    return this.customWidgetRepository.save(customWidget);
  }

  public async updateCustomWidget(
    userId: string,
    id: number,
    params: UpdateCustomWidgetDTO,
    info: AppInfoDTO,
  ) {
    if (userId !== info.authenticatedUser.id) {
      throw new ForbiddenException();
    }

    const { name, widgetId, defaultVisualization, filters } = params;

    const customWidget = await this.customWidgetRepository.findOneBy({
      id,
      user: { id: userId },
    });
    if (customWidget === null) {
      const exception = new NotFoundException('CustomWidget not found');
      this.logger.error(
        `CustomWidget with id ${id} not found`,
        exception.stack,
      );
      throw exception;
    }
    let relatedBaseWidget = customWidget.widget;

    if (name) {
      customWidget.name = name;
    }
    if (widgetId) {
      relatedBaseWidget = await this.baseWidgetRepository.findOneBy({
        id: widgetId,
      });
      if (relatedBaseWidget === null) {
        const exception = new NotFoundException('BaseWidget not found');
        this.logger.error(
          `BaseWidget with id ${id} not found`,
          exception.stack,
        );
        throw exception;
      }
      customWidget.widget = { id: widgetId } as BaseWidget;
    }
    if (defaultVisualization) {
      if (
        WidgetUtils.isValidDefaultVisualization(
          defaultVisualization,
          relatedBaseWidget.visualisations,
        ) === false
      ) {
        throw new BadRequestException(
          `Visualization ${
            params.defaultVisualization
          } is not allowed. Must be one of: ${relatedBaseWidget.visualisations.join(
            ', ',
          )}`,
        );
      }
      customWidget.defaultVisualization = defaultVisualization;
    }
    if (filters) {
      customWidget.filters = filters;
    }
    return this.customWidgetRepository.save(customWidget);
  }

  public async removeCustomWidget(
    userId: string,
    id: number,
    info?: AppInfoDTO,
  ) {
    if (userId !== info.authenticatedUser.id) {
      throw new ForbiddenException();
    }

    const customWidget = await this.customWidgetRepository.findOneBy({
      id,
      user: { id: info.authenticatedUser.id },
    });
    if (customWidget === null) {
      const exception = new NotFoundException('CustomWidget not found');
      this.logger.error(
        `CustomWidget with id ${id} not found`,
        exception.stack,
      );
      throw exception;
    }

    return this.customWidgetRepository.remove(customWidget);
  }
}
