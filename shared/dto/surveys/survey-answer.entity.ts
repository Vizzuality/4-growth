import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity('survey_answers')
@Index(['questionIndicator', 'answer'])
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
  @Index()
  countryCode: string;
}
