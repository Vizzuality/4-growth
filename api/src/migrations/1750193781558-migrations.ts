import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1750193781558 implements MigrationInterface {
  name = 'Migrations1750193781558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE projections CASCADE`);
    await queryRunner.query(`ALTER TABLE "projections" DROP COLUMN "scenario"`);
    await queryRunner.query(
      `CREATE TYPE "public"."projections_scenario_enum" AS ENUM('baseline', 'reimagining_progress', 'the_fractured_continent', 'the_corporate_epoch')`,
    );
    await queryRunner.query(
      `ALTER TABLE "projections" ADD "scenario" "public"."projections_scenario_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."projection_widgets_default_visualization_enum" RENAME TO "projection_widgets_default_visualization_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."projection_widgets_default_visualization_enum" AS ENUM('line_chart', 'area_chart', 'bar_chart', 'bubble_chart', 'table')`,
    );
    await queryRunner.query(
      `ALTER TABLE "projection_widgets" ALTER COLUMN "default_visualization" TYPE "public"."projection_widgets_default_visualization_enum" USING "default_visualization"::"text"::"public"."projection_widgets_default_visualization_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."projection_widgets_default_visualization_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."projection_widgets_default_visualization_enum_old" AS ENUM('line_chart', 'area_chart', 'bar_chart', 'bubble_chart')`,
    );
    await queryRunner.query(
      `ALTER TABLE "projection_widgets" ALTER COLUMN "default_visualization" TYPE "public"."projection_widgets_default_visualization_enum_old" USING "default_visualization"::"text"::"public"."projection_widgets_default_visualization_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."projection_widgets_default_visualization_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."projection_widgets_default_visualization_enum_old" RENAME TO "projection_widgets_default_visualization_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "projections" DROP COLUMN "scenario"`);
    await queryRunner.query(`DROP TYPE "public"."projections_scenario_enum"`);
    await queryRunner.query(
      `ALTER TABLE "projections" ADD "scenario" character varying NOT NULL DEFAULT 'best-case'`,
    );
  }
}
