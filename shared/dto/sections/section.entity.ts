import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('section')
export class Section {
  @PrimaryColumn()
  order: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => BaseWidget, (widget: BaseWidget) => widget.section)
  baseWidgets: BaseWidget[];
}
