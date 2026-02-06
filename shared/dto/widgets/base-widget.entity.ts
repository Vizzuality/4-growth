import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
  Index,
  PrimaryColumn,
} from 'typeorm';
import { CustomWidget } from './custom-widget.entity';
import { Section } from '@shared/dto/sections/section.entity';
import {
  WIDGET_VISUALIZATIONS,
  type WidgetVisualizationsType,
} from '@shared/dto/widgets/widget-visualizations.constants';

@Entity('base_widgets')
export class BaseWidget {
  @PrimaryColumn()
  indicator: string;

  @Column({ name: 'title', nullable: true })
  title: string;

  @Column({ nullable: true })
  question: string;

  @Column({ name: 'question_title', nullable: true })
  questionTitle: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Section, (section: Section) => section.baseWidgets)
  @JoinColumn({ name: 'section_id', referencedColumnName: 'order' })
  section: Section;

  @Column({ name: 'section_order' })
  @Index('idx_section_widgets_section_order')
  sectionOrder: number;

  @Column({ type: 'simple-array', enum: WIDGET_VISUALIZATIONS })
  visualisations: WidgetVisualizationsType[];

  @Column({
    name: 'default_visualization',
    type: 'enum',
    enum: WIDGET_VISUALIZATIONS,
  })
  defaultVisualization: WidgetVisualizationsType;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => CustomWidget, (customWidget) => customWidget.widget, {
    cascade: true,
  })
  customWidgets: CustomWidget[];
}
