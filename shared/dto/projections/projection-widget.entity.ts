import {
  PROJECTION_TYPES,
  type ProjectionType,
} from '@shared/dto/projections/projection-types';
import {
  Projection2DVisualizationsType,
  PROJECTION_2D_VISUALIZATIONS,
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
    enum: PROJECTION_2D_VISUALIZATIONS,
  })
  visualizations: Projection2DVisualizationsType[];

  @Column({
    name: 'default_visualization',
    type: 'enum',
    enum: PROJECTION_2D_VISUALIZATIONS,
  })
  defaultVisualization: Projection2DVisualizationsType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  data?: ProjectionWidgetData[];
}
