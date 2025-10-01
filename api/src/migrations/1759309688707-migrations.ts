import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1759309688707 implements MigrationInterface {
  name = 'Migrations1759309688707';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "configuration_params" ("param" character varying(50) NOT NULL, "value" character varying(255) NOT NULL, CONSTRAINT "PK_4ad968057b2ec3a96feadc861a9" PRIMARY KEY ("param"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "configuration_params"`);
  }
}
