import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { type CustomProjectionSettingsSchemaType } from '@shared/schemas/custom-projection-settings.schema';
import { type SearchFilterDTO } from '@shared/dto/global/search-filters';

@Entity('saved_projections')
export class SavedProjection {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  name: string;

  @Column('jsonb')
  settings: CustomProjectionSettingsSchemaType;

  @Column('jsonb', { name: 'data_filters', nullable: true })
  dataFilters: SearchFilterDTO[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
