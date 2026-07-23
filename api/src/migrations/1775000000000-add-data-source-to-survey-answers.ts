import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDataSourceToSurveyAnswers1775000000000 implements MigrationInterface {
  name = 'AddDataSourceToSurveyAnswers1775000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "survey_answers" ADD COLUMN "data_source" VARCHAR NOT NULL DEFAULT 'survey'`,
    );
    // Drop the FK that tied page_filters.name to question_indicator_map.indicator.
    // data-source is a metadata filter not backed by a question indicator, so this
    // constraint is too restrictive.
    await queryRunner.query(
      `ALTER TABLE "page_filters" DROP CONSTRAINT IF EXISTS "FK_question_indicator_map"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "survey_answers" DROP COLUMN "data_source"`,
    );
    await queryRunner.query(
      `ALTER TABLE "page_filters" ADD CONSTRAINT "FK_question_indicator_map" FOREIGN KEY ("name") REFERENCES "question_indicator_map"("indicator") ON DELETE CASCADE`,
    );
  }
}
