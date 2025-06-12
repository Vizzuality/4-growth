import {
  PROJECTION_TYPES,
  type ProjectionType,
} from '@shared/dto/projections/projection-types';
import {
  PROJECTION_VISUALIZATIONS,
  type ProjectionVisualizationsType,
} from '@shared/dto/projections/projection-visualizations.constants';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

export type ProjectionWidgetData = { year: number; value: number };

@Entity('projection_widgets')
export class ProjectionWidget {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'enum', enum: PROJECTION_TYPES })
  type: ProjectionType;

  @Column()
  title: string;

  @Column({
    name: 'visualizations',
    type: 'simple-array',
    enum: PROJECTION_VISUALIZATIONS,
  })
  visualizations: ProjectionVisualizationsType[];

  @Column({
    name: 'default_visualization',
    type: 'enum',
    enum: PROJECTION_VISUALIZATIONS,
  })
  defaultVisualization: ProjectionVisualizationsType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  data?: ProjectionWidgetData[];
}
