import { Controller } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { usersContract as c } from '@shared/contracts/users.contract';
import { ControllerResponse } from '@api/types/controller.type';
import { CustomWidgetService } from '@api/modules/widgets/custom-widgets.service';
import { AuthorizeByUserIdParam } from '@api/decorators/authorize';

@Controller()
export class CustomWidgetsController {
  public constructor(
    private readonly customWidgetsService: CustomWidgetService,
  ) {}

  @AuthorizeByUserIdParam()
  @TsRestHandler(c.searchCustomWidgets)
  public async searchCustomWidgets(): Promise<ControllerResponse> {
    return tsRestHandler(c.searchCustomWidgets, async ({ params, query }) => {
      const data = await this.customWidgetsService.searchCustomWidgets(
        params.userId,
        query,
      );
      return { body: data, status: 200 };
    });
  }

  @AuthorizeByUserIdParam()
  @TsRestHandler(c.findCustomWidget)
  public async findCustomWidget(): Promise<ControllerResponse> {
    return tsRestHandler(c.findCustomWidget, async ({ params }) => {
      const { userId, id } = params;
      const data = await this.customWidgetsService.findCustomWidgetById(
        userId,
        id,
      );
      return { body: { data }, status: 200 };
    });
  }

  @AuthorizeByUserIdParam()
  @TsRestHandler(c.createCustomWidget)
  public async createCustomWidget(): Promise<ControllerResponse> {
    return tsRestHandler(c.createCustomWidget, async ({ params, body }) => {
      const data = await this.customWidgetsService.createCustomWidget(
        params.userId,
        body,
      );
      return { body: { data }, status: 200 };
    });
  }

  @AuthorizeByUserIdParam()
  @TsRestHandler(c.updateCustomWidget)
  public async updateCustomWidget(): Promise<ControllerResponse> {
    return tsRestHandler(c.updateCustomWidget, async ({ params, body }) => {
      const { userId, id } = params;
      const data = await this.customWidgetsService.updateCustomWidget(
        userId,
        id,
        body,
      );
      return { body: { data }, status: 200 };
    });
  }

  @AuthorizeByUserIdParam()
  @TsRestHandler(c.deleteCustomWidget)
  public async deleteCustomWidget(): Promise<ControllerResponse> {
    return tsRestHandler(c.deleteCustomWidget, async ({ params }) => {
      const { userId, id } = params;
      const data = await this.customWidgetsService.deleteCustomWidget(
        userId,
        id,
      );
      return { body: { data }, status: 200 };
    });
  }
}
