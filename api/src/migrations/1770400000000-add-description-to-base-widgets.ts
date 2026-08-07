import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionToBaseWidgets1770400000000 implements MigrationInterface {
  name = 'AddDescriptionToBaseWidgets1770400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "base_widgets" ADD "description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "base_widgets" DROP COLUMN "description"`,
    );
  }
}
