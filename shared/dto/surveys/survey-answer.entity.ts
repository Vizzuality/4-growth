import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity('survey_answers')
@Index('idx_survey_answers_question_answer', ['questionIndicator', 'answer'])
export class SurveyAnswer {
  @PrimaryColumn({ name: 'survey_id' })
  surveyId: string;

  @PrimaryColumn({ name: 'question_indicator' })
  questionIndicator: string;

  @Column({ nullable: false })
  question: string;

  @Column({ nullable: false })
  answer: string;

  @Column({ name: 'country_code', nullable: false })
  @Index('idx_survey_answers_country_code')
  countryCode: string;

  @Column({ nullable: false, default: 1 })
  wave: number;
}
