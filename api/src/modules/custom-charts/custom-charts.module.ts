import { Module } from '@nestjs/common';
import { CustomChartsController } from './custom-charts.controller';
import { CustomChartsService } from './custom-charts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomChart } from '@shared/dto/custom-charts/custom-chart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomChart])],
  controllers: [CustomChartsController],
  providers: [CustomChartsService],
  exports: [CustomChartsService],
})
export class CustomChartsModule {}
