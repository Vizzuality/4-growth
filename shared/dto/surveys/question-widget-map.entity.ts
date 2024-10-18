import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity('question_indicator_map')
@Unique('UQ_question_indicator_map_indicator_question', [
  'indicator',
  'question',
])
export class QuestionIndicatorMap {
  @PrimaryColumn()
  indicator: string;

  @Column()
  question: string;
}
