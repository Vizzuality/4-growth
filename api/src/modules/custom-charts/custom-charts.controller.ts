import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CustomChartsService } from '@api/modules/custom-charts/custom-charts.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { customChartsContract as c } from '@shared/contracts/custom-charts.contract';
import { UpdateCustomChartDto } from '@shared/dto/custom-charts/update-custom-chart.dto';

@Controller()
export class CustomChartsController {
  constructor(private readonly customChartService: CustomChartsService) {}

  @TsRestHandler(c.getCustomCharts)
  async getCustomCharts(): Promise<any> {
    return tsRestHandler(c.getCustomCharts, async ({ query }) => {
      const customCharts =
        await this.customChartService.findAllPaginated(query);
      return { body: customCharts, status: HttpStatus.OK };
    });
  }

  @TsRestHandler(c.getCustomChart)
  async getCustomChart(): Promise<any> {
    return tsRestHandler(c.getCustomChart, async (request) => {
      const customChart = await this.customChartService.getById(
        request.params.id,
      );
      return { body: { data: customChart }, status: HttpStatus.OK };
    });
  }

  @TsRestHandler(c.updateCustomChart)
  async updateCustomChart(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomChartDto,
  ): Promise<any> {
    return tsRestHandler(c.updateCustomChart, async () => {
      const customChart = await this.customChartService.update(id, dto);
      return { body: { data: customChart }, status: HttpStatus.OK };
    });
  }

  @TsRestHandler(c.deleteCustomChart)
  async deleteCustomChart(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<any> {
    return tsRestHandler(c.deleteCustomChart, async () => {
      await this.customChartService.remove(id);
      return { body: null, status: HttpStatus.OK };
    });
  }
}
