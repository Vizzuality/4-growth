import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuestionTitleToBaseWidgets1760041870431
  implements MigrationInterface
{
  name = 'AddQuestionTitleToBaseWidgets1760041870431';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "base_widgets" ADD "question_title" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "base_widgets" DROP COLUMN "question_title"`,
    );
  }
}
