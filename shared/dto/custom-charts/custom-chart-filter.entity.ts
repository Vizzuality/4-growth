import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CustomChart } from '@shared/dto/custom-charts/custom-chart.entity';
import { JoinColumn } from 'typeorm';

export enum CHART_FILTER_ATTRIBUTES {
  COUNTRY = 'country',
  OPERATIONAL_AREAS = 'operational_areas',
  TECHNOLOGY_TYPES = 'technology_types',
}

@Entity({ name: 'chart_filters' })
export class ChartFilter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: CHART_FILTER_ATTRIBUTES })
  attribute: CHART_FILTER_ATTRIBUTES;

  @Column({ type: 'varchar' })
  value: string;

  @ManyToOne(() => CustomChart, (customChart) => customChart.chartFilters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'custom_chart_id' })
  customChart: CustomChart;
}
