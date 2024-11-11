import { Controller, HttpStatus } from '@nestjs/common';
import { WidgetsService } from './widgets.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { widgetsContract as c } from '@shared/contracts/base-widgets.contract';
import { ControllerResponse } from '@api/types/controller.type';
import { Public } from '@api/decorators/is-public.decorator';

@Controller()
export class WidgetsController {
  constructor(private widgetsService: WidgetsService) {}

  @Public()
  @TsRestHandler(c.getWidgets)
  public async getWidgets(): Promise<ControllerResponse> {
    return tsRestHandler(c.getWidgets, async ({ query }) => {
      const widgets = await this.widgetsService.findAllPaginated(query);
      return { body: widgets, status: HttpStatus.OK };
    });
  }

  @Public()
  @TsRestHandler(c.getWidget)
  public async getWidget(): Promise<ControllerResponse> {
    return tsRestHandler(c.getWidget, async ({ params: { id }, query }) => {
      const widget = await this.widgetsService.findWidgetWithDataById(
        id,
        query,
      );
      return { body: { data: widget }, status: HttpStatus.OK };
    });
  }
}
