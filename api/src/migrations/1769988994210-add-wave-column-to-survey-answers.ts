import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWaveColumnToSurveyAnswers1769988994210 implements MigrationInterface {
  name = 'AddWaveColumnToSurveyAnswers1769988994210';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add wave column with default value of 1 for existing data
    await queryRunner.query(
      `ALTER TABLE "survey_answers" ADD COLUMN "wave" INTEGER NOT NULL DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "survey_answers" DROP COLUMN "wave"`);
  }
}
