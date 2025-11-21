import { ProjectionData } from '@shared/dto/projections/projection-data.entity';
import { ProjectionType } from '@shared/dto/projections/projection-type.entity';
import {
  PROJECTION_TYPES,
  ProjectionScenarios,
} from '@shared/dto/projections/projection-types';
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('projections')
export class Projection {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'category', type: 'varchar', length: 100 })
  category: string;

  @ManyToOne(() => ProjectionType)
  @JoinColumn({ name: 'type', referencedColumnName: 'id' })
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
