import { CustomValueTransformers } from '@shared/lib/custom-value-transformers';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('page_filters')
export class PageFilter {
  @PrimaryColumn()
  name: string;

  @Column({
    type: 'text',
    transformer: CustomValueTransformers.semiColonSeparator,
  })
  values: string[];
}
