import { CustomValueTransformers } from '@shared/lib/custom-value-transformers';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export const PROJECTION_FILTER_NAME_TO_FIELD_NAME = {
  type: 'type',
  scenario: 'scenario',
  technology: 'technology',
  'technology-type': 'technologyType',
  country: 'country',
};

export const AVAILABLE_PROJECTION_FILTERS = Object.keys(
  PROJECTION_FILTER_NAME_TO_FIELD_NAME,
).splice(1);

@Entity('projection_filters')
export class ProjectionFilter {
  @PrimaryColumn()
  name: string;

  @Column()
  label: string;

  @Column({
    type: 'text',
    transformer: CustomValueTransformers.semiColonSeparator,
  })
  values: string[];
}
