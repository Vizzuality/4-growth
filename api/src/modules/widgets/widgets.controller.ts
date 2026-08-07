import { Controller, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';
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

  @Public()
  @TsRestHandler(c.exportWidget)
  public async exportWidget(
    @Res({ passthrough: true }) res: Response,
  ): Promise<ControllerResponse> {
    return tsRestHandler(c.exportWidget, async ({ params: { id }, query }) => {
      const { csv, filename } = await this.widgetsService.exportWidgetCsv(
        id,
        query,
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      return { body: csv, status: HttpStatus.OK };
    });
  }
}
