import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1747996405328 implements MigrationInterface {
  name = 'Migrations1747996405328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projection_data" DROP CONSTRAINT "PK_6e485547f8e01229d03813ccb1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projection_data" ADD CONSTRAINT "PK_decbfe5915fc99f2580ee00cdd1" PRIMARY KEY ("projection_id", "year")`,
    );
    await queryRunner.query(
      `ALTER TABLE "projection_data" DROP CONSTRAINT "FK_899c327d7b3d9ff99aaeabc7327"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projection_data" ALTER COLUMN "projection_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "projection_data" ADD CONSTRAINT "FK_899c327d7b3d9ff99aaeabc7327" FOREIGN KEY ("projection_id") REFERENCES "projections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projection_data" DROP CONSTRAINT "FK_899c327d7b3d9ff99aaeabc7327"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projection_data" ALTER COLUMN "projection_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "projection_data" ADD CONSTRAINT "FK_899c327d7b3d9ff99aaeabc7327" FOREIGN KEY ("projection_id") REFERENCES "projections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projection_data" DROP CONSTRAINT "PK_decbfe5915fc99f2580ee00cdd1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projection_data" ADD CONSTRAINT "PK_6e485547f8e01229d03813ccb1c" PRIMARY KEY ("year")`,
    );
  }
}
