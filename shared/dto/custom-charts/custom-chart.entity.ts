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

export enum CUSTOM_CHART_TYPE {
  MAP = 'map',
  BAR = 'bar',
  DOUGHNUT = 'doughnut',
  STACKED_BAR = 'stacked_bar',
}

// TODO: We don't really know if this will be a enum, a table, or where to get the values from

export enum INDICATORS {
  DIGITAL_TECHNOLOGIES = 'digital_technologies',
  GOALS_OR_CHALLENGES = 'goals_or_challenges',
}

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
