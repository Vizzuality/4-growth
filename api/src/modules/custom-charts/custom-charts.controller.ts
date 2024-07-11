import { Controller } from '@nestjs/common';
import { CustomChartsService } from '@api/modules/custom-charts/custom-charts.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { customChartsContract as c } from '@shared/contracts/custom-charts.contrac';

@Controller()
export class CustomChartsController {
  constructor(private readonly customChartService: CustomChartsService) {}

  @TsRestHandler(c.getCustomCharts)
  async getCustomCharts(): Promise<any> {
    return tsRestHandler(c.getCustomCharts, async ({ query }) => {
      const customCharts =
        await this.customChartService.findAllPaginated(query);
      return { body: customCharts, status: 200 };
    });
  }

  @TsRestHandler(c.getCustomChart)
  async getCustomChart(): Promise<any> {
    return tsRestHandler(c.getCustomChart, async (request) => {
      const customChart = await this.customChartService.getById(
        request.params.id,
      );
      return { body: { data: customChart }, status: 200 };
    });
  }
}
