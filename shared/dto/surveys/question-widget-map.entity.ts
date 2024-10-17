import { Entity, PrimaryColumn } from 'typeorm';

@Entity('question_indicator_map')
export class QuestionIndicatorMap {
  @PrimaryColumn()
  indicator: string;

  @PrimaryColumn()
  question: string;
}
