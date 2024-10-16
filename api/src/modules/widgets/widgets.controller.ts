import { Controller, HttpStatus, Param } from '@nestjs/common';
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
  async getWidgets(): Promise<ControllerResponse> {
    return tsRestHandler(c.getWidgets, async ({ query }) => {
      const widgets = await this.widgetsService.findAllPaginated(query);
      return { body: widgets, status: HttpStatus.OK };
    });
  }

  @Public()
  @TsRestHandler(c.getWidget)
  async getWidget(@Param('id') id: string): Promise<any> {
    return tsRestHandler(c.getWidget, async ({ query }) => {
      const widget = await this.widgetsService.getById(id, query);
      return { body: { data: widget }, status: HttpStatus.OK };
    });
  }
}
