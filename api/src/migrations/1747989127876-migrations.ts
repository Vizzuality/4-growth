import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1747989127876 implements MigrationInterface {
  name = 'Migrations1747989127876';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "base_widgets" DROP CONSTRAINT "FK_ec4ecfd98ca886865a3f579994f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_widgets" DROP CONSTRAINT "FK_dac539060d0b71bf4aeeb52b205"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_widgets" DROP CONSTRAINT "FK_ba78a479ff764c0aa29e8f97ace"`,
    );
    await queryRunner.query(
      `CREATE TABLE "projection_data" ("id" integer NOT NULL, "year" integer NOT NULL, "value" double precision NOT NULL, "projection_id" integer, CONSTRAINT "PK_92af84ffd90e7c9cc9a6116d5cd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."projections_type_enum" AS ENUM('market-potential', 'addressable-market', 'penetration', 'shipments', 'installed-base', 'prices', 'revenues')`,
    );
    await queryRunner.query(
      `CREATE TABLE "projections" ("id" integer NOT NULL, "type" "public"."projections_type_enum" NOT NULL, "technology" character varying NOT NULL, "subsegment" character varying NOT NULL, "application" character varying NOT NULL, "technology_type" character varying NOT NULL, "country" character varying NOT NULL, "region" character varying NOT NULL, "unit" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a510816cc1c13126a6664198331" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "projection_filters" ("name" character varying NOT NULL, "values" text NOT NULL, CONSTRAINT "PK_7e977177ade5d81cd139bb57a01" PRIMARY KEY ("name"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."projection_widgets_type_enum" AS ENUM('market-potential', 'addressable-market', 'penetration', 'shipments', 'installed-base', 'prices', 'revenues')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."projection_widgets_default_visualization_enum" AS ENUM('line_chart', 'area_chart', 'bar_chart', 'bubble_chart')`,
    );
    await queryRunner.query(
      `CREATE TABLE "projection_widgets" ("id" integer NOT NULL, "type" "public"."projection_widgets_type_enum" NOT NULL, "title" character varying NOT NULL, "visualizations" text NOT NULL, "default_visualization" "public"."projection_widgets_default_visualization_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ac1b9eebd990534fd28d9a0dd63" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "base_widgets" ADD CONSTRAINT "FK_ec4ecfd98ca886865a3f579994f" FOREIGN KEY ("section_id") REFERENCES "sections"("order") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_widgets" ADD CONSTRAINT "FK_dac539060d0b71bf4aeeb52b205" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_widgets" ADD CONSTRAINT "FK_87592e3da50d4efdd8935abf268" FOREIGN KEY ("widget_indicator") REFERENCES "base_widgets"("indicator") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "custom_widgets" DROP CONSTRAINT "FK_87592e3da50d4efdd8935abf268"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_widgets" DROP CONSTRAINT "FK_dac539060d0b71bf4aeeb52b205"`,
    );
    await queryRunner.query(
      `ALTER TABLE "base_widgets" DROP CONSTRAINT "FK_ec4ecfd98ca886865a3f579994f"`,
    );
    await queryRunner.query(`DROP TABLE "projection_widgets"`);
    await queryRunner.query(
      `DROP TYPE "public"."projection_widgets_default_visualization_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."projection_widgets_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "projection_filters"`);
    await queryRunner.query(`DROP TABLE "projections"`);
    await queryRunner.query(`DROP TYPE "public"."projections_type_enum"`);
    await queryRunner.query(`DROP TABLE "projection_data"`);
    await queryRunner.query(
      `ALTER TABLE "custom_widgets" ADD CONSTRAINT "FK_ba78a479ff764c0aa29e8f97ace" FOREIGN KEY ("widget_indicator") REFERENCES "base_widgets"("indicator") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_widgets" ADD CONSTRAINT "FK_dac539060d0b71bf4aeeb52b205" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "base_widgets" ADD CONSTRAINT "FK_ec4ecfd98ca886865a3f579994f" FOREIGN KEY ("section_id") REFERENCES "sections"("order") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
