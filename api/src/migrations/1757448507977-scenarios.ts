import { MigrationInterface, QueryRunner } from 'typeorm';

export class Scenarios1757448507977 implements MigrationInterface {
  name = 'Scenarios1757448507977';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projections" ADD "category" character varying(100) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projections" DROP COLUMN "category"`);
  }
}
