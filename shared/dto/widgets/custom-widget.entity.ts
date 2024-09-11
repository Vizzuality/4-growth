import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseWidget } from './base-widget.entity';
import { User } from '../users/user.entity';
import {
  WIDGET_VISUALIZATIONS,
  type WidgetVisualizationsType,
} from './widget-visualizations.constants';

@Entity('custom_widgets')
export class CustomWidget {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user: User) => user.customWidgets)
  user: User;

  @Column()
  name: string;

  @ManyToOne(() => BaseWidget, (widget: BaseWidget) => widget.customWidgets)
  widget: BaseWidget;

  @Column({
    name: 'default_visualization',
    type: 'enum',
    enum: WIDGET_VISUALIZATIONS,
  })
  defaultVisualization: WidgetVisualizationsType;

  @Column('jsonb')
  filters: any;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
