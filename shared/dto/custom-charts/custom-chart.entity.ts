import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@shared/dto/users/user.entity';
import { ChartFilter } from '@shared/dto/custom-charts/custom-chart-filter.entity';

import { INDICATORS, CUSTOM_CHART_TYPE } from './custom-chart.constants';

@Entity({ name: 'custom_charts' })
export class CustomChart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({
    type: 'enum',
    enum: CUSTOM_CHART_TYPE,
    default: CUSTOM_CHART_TYPE.BAR,
  })
  type: CUSTOM_CHART_TYPE;

  @Column({ type: 'enum', enum: INDICATORS })
  indicator: INDICATORS;

  @Column({ type: 'boolean', name: 'is_public', default: false })
  isPublic: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.customCharts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => ChartFilter, (chartFilter) => chartFilter.customChart)
  chartFilters: ChartFilter[];
}
