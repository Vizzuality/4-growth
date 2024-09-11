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
