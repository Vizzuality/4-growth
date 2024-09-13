import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('sections')
export class Section {
  @PrimaryColumn()
  order: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => BaseWidget, (widget: BaseWidget) => widget.section)
  baseWidgets: BaseWidget[];
}
