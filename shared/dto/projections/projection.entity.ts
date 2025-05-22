import { ProjectionData } from '@shared/dto/projections/projection-data.entity';
import {
  PROJECTION_TYPES,
  ProjectionType,
} from '@shared/dto/projections/projection-types';
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('projections')
export class Projection {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'type', type: 'enum', enum: PROJECTION_TYPES })
  type: ProjectionType;

  @Column({ name: 'scenario' })
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
