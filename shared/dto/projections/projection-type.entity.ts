import {
  PROJECTION_TYPES,
  ProjectionType as ProjectionTypeEnum,
} from '@shared/dto/projections/projection-types';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('projection_types')
export class ProjectionType {
  @PrimaryColumn({ type: 'enum', enum: PROJECTION_TYPES })
  id: ProjectionTypeEnum;

  @Column({ type: 'text' })
  description: string;
}
