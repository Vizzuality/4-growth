import { Controller } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { usersContract as c } from '@shared/contracts/users.contract';
import { ControllerResponse } from '@api/types/controller.type';
import { CustomWidgetService } from '@api/modules/widgets/custom-widgets.service';
import { GetUser } from '@api/decorators/get-user.decorator';
import { User } from '@shared/dto/users/user.entity';
import {
  FetchSpecification,
  ProcessFetchSpecification,
} from 'nestjs-base-service';

@Controller()
export class CustomWidgetsController {
  public constructor(
    private readonly customWidgetsService: CustomWidgetService,
  ) {}

  @TsRestHandler(c.searchCustomWidgets)
  public async searchCustomWidgets(
    @ProcessFetchSpecification()
    queryDTO: FetchSpecification,
    @GetUser()
    user: User,
  ): Promise<ControllerResponse> {
    return tsRestHandler(c.searchCustomWidgets, async ({ params }) => {
      const data = await this.customWidgetsService.searchCustomWidgets(
        params.userId,
        queryDTO,
        {
          authenticatedUser: user,
        },
      );
      return { body: data, status: 200 };
    });
  }

  @TsRestHandler(c.findCustomWidget)
  public async findCustomWidget(
    @GetUser() user: User,
  ): Promise<ControllerResponse> {
    return tsRestHandler(c.findCustomWidget, async ({ params }) => {
      const { userId, id } = params;
      const data = await this.customWidgetsService.findCustomWidgetById(
        userId,
        Number.parseInt(id),
        {
          authenticatedUser: user,
        },
      );
      return { body: { data }, status: 200 };
    });
  }

  @TsRestHandler(c.createCustomWidget)
  public async createCustomWidget(
    @GetUser() user: User,
  ): Promise<ControllerResponse> {
    return tsRestHandler(c.createCustomWidget, async ({ params, body }) => {
      const data = await this.customWidgetsService.createCustomWidget(
        params.userId,
        body,
        {
          authenticatedUser: user,
        },
      );
      return { body: { data }, status: 200 };
    });
  }

  @TsRestHandler(c.updateCustomWidget)
  public async updateCustomWidget(
    @GetUser() user: User,
  ): Promise<ControllerResponse> {
    return tsRestHandler(c.updateCustomWidget, async ({ params, body }) => {
      const { userId, id } = params;
      const data = await this.customWidgetsService.updateCustomWidget(
        userId,
        Number.parseInt(id),
        body,
        {
          authenticatedUser: user,
        },
      );
      return { body: { data }, status: 200 };
    });
  }

  @TsRestHandler(c.deleteCustomWidget)
  public async deleteCustomWidget(
    @GetUser() user: User,
  ): Promise<ControllerResponse> {
    return tsRestHandler(c.deleteCustomWidget, async ({ params }) => {
      const { userId, id } = params;
      const data = await this.customWidgetsService.removeCustomWidget(
        userId,
        Number.parseInt(id),
        {
          authenticatedUser: user,
        },
      );
      return { body: { data }, status: 200 };
    });
  }
}
