import { ProjectionData } from '@shared/dto/projections/projection-data.entity';
import { PROJECTION_TYPES } from '@shared/dto/projections/projection-types';
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

export const ProjectionScenarios = {
  BASELINE: 'baseline',
  REIMAGINING_PROGRESS: 'reimagining_progress',
  THE_FRACTURED_CONTINENT: 'the_fractured_continent',
  THE_CORPORATE_EPOCH: 'the_corporate_epoch',
};

@Entity('projections')
export class Projection {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'type', type: 'enum', enum: PROJECTION_TYPES })
  type: string;

  @Column({ name: 'scenario', type: 'enum', enum: ProjectionScenarios })
  scenario: string;

  @Column()
  technology: string;

  @Column()
  subsegment: string;

  @Column()
  application: string;

  @Column({ name: 'technology_type' })
  technologyType: string;

  @Column()
  country: string;

  @Column()
  region: string;

  @Column()
  unit: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @OneToMany(
    () => ProjectionData,
    (projectionData) => projectionData.projection,
    { cascade: true, eager: true },
  )
  projectionData: ProjectionData[];
}
