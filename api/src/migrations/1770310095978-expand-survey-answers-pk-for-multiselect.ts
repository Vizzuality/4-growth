import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExpandSurveyAnswersPkForMultiselect1770310095978
  implements MigrationInterface
{
  name = 'ExpandSurveyAnswersPkForMultiselect1770310095978';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Find the current PK constraint name dynamically
    const pkResult = await queryRunner.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'survey_answers'
        AND constraint_type = 'PRIMARY KEY'
    `);
    const pkName = pkResult[0]?.constraint_name;

    // 2. Drop the existing PK
    if (pkName) {
      await queryRunner.query(
        `ALTER TABLE "survey_answers" DROP CONSTRAINT "${pkName}"`,
      );
    }

    // 3. Create new PK with explicit name that includes answer column
    await queryRunner.query(`
      ALTER TABLE "survey_answers"
      ADD CONSTRAINT "PK_survey_answers_multiselect"
      PRIMARY KEY ("survey_id", "question_indicator", "answer")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // DOWN is destructive - removes multi-select answers
    // 1. Remove duplicates (keep one per survey_id + question_indicator)
    await queryRunner.query(`
      DELETE FROM "survey_answers" a
      USING "survey_answers" b
      WHERE a.ctid > b.ctid
        AND a.survey_id = b.survey_id
        AND a.question_indicator = b.question_indicator
    `);

    // 2. Change PK back
    await queryRunner.query(
      `ALTER TABLE "survey_answers" DROP CONSTRAINT "PK_survey_answers_multiselect"`,
    );
    await queryRunner.query(`
      ALTER TABLE "survey_answers"
      ADD CONSTRAINT "PK_9474d624fb654ce2f69c74bb262"
      PRIMARY KEY ("survey_id", "question_indicator")
    `);
  }
}
