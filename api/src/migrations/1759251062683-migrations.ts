import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1759251062683 implements MigrationInterface {
  name = 'Migrations1759251062683';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add column as nullable
    await queryRunner.query(`
      ALTER TABLE "page_filters"
      ADD COLUMN "label" varchar NULL
    `);

    // 2. Backfill existing rows (example: use id to create a unique label)
    await queryRunner.query(`
      UPDATE "page_filters"
      SET "label" = 'filter_' || "name"
      WHERE "label" IS NULL
    `);

    // 3. Make the column NOT NULL
    await queryRunner.query(`
      ALTER TABLE "page_filters"
      ALTER COLUMN "label" SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "page_filters" DROP COLUMN "label"`);
  }
}
