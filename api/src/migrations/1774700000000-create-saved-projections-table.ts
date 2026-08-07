import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSavedProjectionsTable1774700000000 implements MigrationInterface {
  name = 'CreateSavedProjectionsTable1774700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "saved_projections" (
        "id" SERIAL PRIMARY KEY,
        "user_id" uuid REFERENCES "users"("id") ON DELETE CASCADE,
        "name" character varying NOT NULL,
        "settings" jsonb NOT NULL,
        "data_filters" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "saved_projections"`);
  }
}
