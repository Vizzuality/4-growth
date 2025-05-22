import { Projection } from '@shared/dto/projections/projection.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

// export type ProjectionDataItem = { year: number; value: number };

@Entity('projection_data')
export class ProjectionData {
  @ManyToOne(
    () => Projection,
    (projectionData) => projectionData.projectionData,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'projection_id', referencedColumnName: 'id' })
  @PrimaryColumn({ name: 'projection_id', type: 'int' })
  projection: Projection;

  @PrimaryColumn({ name: 'year', type: 'int' })
  year: number;

  @Column({ type: 'float' })
  value: number;
}
