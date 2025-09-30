import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1759247691374 implements MigrationInterface {
  name = 'Migrations1759247691374';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "base_widgets" ADD "title" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "base_widgets" DROP COLUMN "title"`);
  }
}
