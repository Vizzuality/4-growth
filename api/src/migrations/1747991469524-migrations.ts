import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1747991469524 implements MigrationInterface {
  name = 'Migrations1747991469524';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projection_data" DROP CONSTRAINT "PK_92af84ffd90e7c9cc9a6116d5cd"`,
    );
    await queryRunner.query(`ALTER TABLE "projection_data" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "projection_data" ADD CONSTRAINT "PK_6e485547f8e01229d03813ccb1c" PRIMARY KEY ("year")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projection_data" DROP CONSTRAINT "PK_6e485547f8e01229d03813ccb1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projection_data" ADD "id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "projection_data" ADD CONSTRAINT "PK_92af84ffd90e7c9cc9a6116d5cd" PRIMARY KEY ("id")`,
    );
  }
}
