import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { BaseWidget } from './base-widget.entity';
import { User } from '../users/user.entity';
import {
  WIDGET_VISUALIZATIONS,
  type WidgetVisualizationsType,
} from './widget-visualizations.constants';
import { WidgetFilters } from '@shared/dto/widgets/base-widget-data.interface';

@Entity('custom_widgets')
export class CustomWidget {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user: User) => user.customWidgets)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  name: string;

  @ManyToOne(() => BaseWidget, (widget: BaseWidget) => widget.customWidgets)
  @JoinColumn({ name: 'widget_id' })
  widget: BaseWidget;

  @Column({
    name: 'default_visualization',
    type: 'enum',
    enum: WIDGET_VISUALIZATIONS,
  })
  defaultVisualization: WidgetVisualizationsType;

  @Column('jsonb')
  filters: WidgetFilters;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
