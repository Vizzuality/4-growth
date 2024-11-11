import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('question_indicator_map')
export class QuestionIndicatorMap {
  @PrimaryColumn()
  indicator: string;

  @Column()
  question: string;
}
