/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppBaseService } from '@api/utils/app-base.service';
import { AppInfoDTO } from '@api/utils/info.dto';
import {
  BadRequestException,
  Injectable,
  Logger,
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
    // It has to be protected in order to correctly extend the class
    protected readonly logger: Logger,
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
  ): Promise<ApiPaginationResponse<CustomWidget>> {
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
  ): Promise<CustomWidget> {
    const customWidget = await this.customWidgetRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
      relations: ['widget'],
    });

    if (customWidget === null) {
      throw new NotFoundException('CustomWidget not found');
    }
    return customWidget;
  }

  public async createCustomWidget(
    userId: string,
    params: CreateCustomWidgetDTO,
  ): Promise<CustomWidget> {
    const baseWidget = await this.baseWidgetRepository.findOneBy({
      indicator: params.widgetIndicator,
    });
    if (baseWidget === null) {
      const exception = new NotFoundException('BaseWidget not found');
      this.logger.error(
        `BaseWidget with id ${params.widgetIndicator} not found`,
        null,
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
      widget: { indicator: params.widgetIndicator },
      user: { id: userId },
      filters: params.filters,
      defaultVisualization: params.defaultVisualization,
    };
    return this.customWidgetRepository.save(customWidget);
  }

  public async updateCustomWidget(
    userId: string,
    id: number,
    params: UpdateCustomWidgetDTO,
  ) {
    const { name, widgetIndicator, defaultVisualization, filters } = params;

    const customWidget = await this.customWidgetRepository.findOneBy({
      id,
      user: { id: userId },
    });
    if (customWidget === null) {
      const exception = new NotFoundException('CustomWidget not found');
      this.logger.error(
        `CustomWidget with id ${id} not found`,
        null,
        exception.stack,
      );
      throw exception;
    }

    let relatedBaseWidget = customWidget.widget;

    if (name) {
      customWidget.name = name;
    }
    if (widgetIndicator) {
      relatedBaseWidget = await this.baseWidgetRepository.findOneBy({
        indicator: widgetIndicator,
      });

      if (relatedBaseWidget === null) {
        const exception = new NotFoundException('BaseWidget not found');
        this.logger.error(
          `BaseWidget with id ${id} not found`,
          null,
          exception.stack,
        );
        throw exception;
      }
      customWidget.widget = { indicator: widgetIndicator } as BaseWidget;
      customWidget.defaultVisualization =
        relatedBaseWidget.defaultVisualization;
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

  public async deleteCustomWidget(
    userId: string,
    id: number,
    info?: AppInfoDTO,
  ) {
    const customWidget = await this.customWidgetRepository.findOneBy({
      id,
      user: { id: userId },
    });
    if (customWidget === null) {
      const exception = new NotFoundException('CustomWidget not found');
      this.logger.error(
        `CustomWidget with id ${id} not found`,
        null,
        exception.stack,
      );
      throw exception;
    }

    // TODO: There are differences between remove() and delete() methods of the repository. Main differences:
    //       1- similarly as save() vs insert(), remove first loads the entity, effectively making two queries, while delete does not.
    //       2- it has it's usages (you can check), but I don't see any reasons right now to use remove right now. I am not saying we should not use it here
    //          I just want you to be aware of the differences.
    //       3- Following the previous point, remove mutates the original object, removing the id field, so we should be careful with the mutability
    //       4- Last point, we should not return to the consumer the deleted entity, as it is not available anymore. Right now there is no usage for that
    return this.customWidgetRepository.remove(customWidget);
  }
}
