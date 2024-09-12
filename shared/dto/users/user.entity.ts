import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { CustomChart } from '@shared/dto/custom-charts/custom-chart.entity';
import { CustomWidget } from '../widgets/custom-widget.entity';
import { EntityQueryResource } from '@shared/dto/global/entity.query-resource';

export const userQueryResource: EntityQueryResource<> = {
  fields: ['id', 'email', 'createdAt'],
  include: ['customCharts'],
  filter: ['email'],
  omitFields: ['id'],
  sort: ['createdAt'],
};

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => CustomChart, (customChart) => customChart.user)
  customCharts: CustomChart[];

  @OneToMany(() => CustomWidget, (customWidget) => customWidget.user)
  customWidgets: CustomWidget[];
}
