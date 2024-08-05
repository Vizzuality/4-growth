import { Injectable } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { CustomChart } from '@shared/dto/custom-charts/custom-chart.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomChartDto } from '@shared/dto/custom-charts/create-custom-chart.dto';
import { UpdateCustomChartDto } from '@shared/dto/custom-charts/update-custom-chart.dto';
import { AppInfoDTO } from '@api/utils/info.dto';

@Injectable()
export class CustomChartsService extends AppBaseService<
  CustomChart,
  CreateCustomChartDto,
  UpdateCustomChartDto,
  AppInfoDTO
> {
  constructor(
    @InjectRepository(CustomChart)
    private customChartRepository: Repository<CustomChart>,
  ) {
    super(customChartRepository);
  }

  async extendFindAllQuery(
    query: SelectQueryBuilder<CustomChart>,
    fetchSpecification: Record<string, unknown>,
  ) {
    if (fetchSpecification.userId) {
      query
        .innerJoin(`${this.alias}.user`, 'user')
        .where('user.id = :userId', { userId: fetchSpecification.userId });
    }
    return query;
  }
}
