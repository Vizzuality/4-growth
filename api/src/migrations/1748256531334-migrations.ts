import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1748256531334 implements MigrationInterface {
  name = 'Migrations1748256531334';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projections" ADD "scenario" character varying NOT NULL DEFAULT 'best-case'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projections" DROP COLUMN "scenario"`);
  }
}
