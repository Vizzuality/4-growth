import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialTablesAndIndexes1729163940111
  implements MigrationInterface
{
  name = 'InitialSchema1729163940111';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."base_widgets_default_visualization_enum" AS ENUM('single_value', 'map', 'horizontal_bar_chart', 'pie_chart', 'area_graph', 'filter', 'navigation')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."custom_widgets_default_visualization_enum" AS ENUM('single_value', 'map', 'horizontal_bar_chart', 'pie_chart', 'area_graph', 'filter', 'navigation')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sections" ("order" integer NOT NULL, "slug" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6585d4a8196db804deedc1b343a" UNIQUE ("slug"), CONSTRAINT "PK_a605d9121e6cc3e665f24314ad8" PRIMARY KEY ("order"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "base_widgets" ("id" SERIAL NOT NULL, "question" character varying, "indicator" character varying, "section_order" integer NOT NULL, "visualisations" text NOT NULL, "default_visualization" "public"."base_widgets_default_visualization_enum" NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "section_id" integer, CONSTRAINT "PK_93f5f3f72fcf9fb685e887c8064" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_section_widgets_section_order" ON "base_widgets" ("section_order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "custom_widgets" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "default_visualization" "public"."custom_widgets_default_visualization_enum" NOT NULL, "filters" jsonb NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "widget_id" integer, CONSTRAINT "PK_a5d2205ca142399bde7d3f2b1cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "api_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "associatedId" uuid, "data" jsonb, CONSTRAINT "PK_e3826ce4ae3f91c05bd37bb1502" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "page_filters" ("name" character varying NOT NULL, "values" text NOT NULL, CONSTRAINT "PK_066730e267edae13a61a79b8bd3" PRIMARY KEY ("name"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "survey_answers" ("survey_id" character varying NOT NULL, "question_indicator" character varying NOT NULL, "question" character varying NOT NULL, "answer" character varying NOT NULL, "country_code" character varying NOT NULL, CONSTRAINT "PK_9474d624fb654ce2f69c74bb262" PRIMARY KEY ("survey_id", "question_indicator"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_survey_answers_country_code" ON "survey_answers" ("country_code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_survey_answers_question_answer" ON "survey_answers" ("question_indicator", "answer") `,
    );
    await queryRunner.query(
      `CREATE TABLE "question_indicator_map" ("indicator" character varying NOT NULL, "question" character varying NOT NULL, CONSTRAINT "PK_75e60c595a8a13cfe41e4710633" PRIMARY KEY ("indicator", "question"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "base_widgets" ADD CONSTRAINT "FK_ec4ecfd98ca886865a3f579994f" FOREIGN KEY ("section_id") REFERENCES "sections"("order") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_widgets" ADD CONSTRAINT "FK_dac539060d0b71bf4aeeb52b205" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_widgets" ADD CONSTRAINT "FK_ba78a479ff764c0aa29e8f97ace" FOREIGN KEY ("widget_id") REFERENCES "base_widgets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TYPE "public"."base_widgets_default_visualization_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."custom_widgets_default_visualization_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_widgets" DROP CONSTRAINT "FK_ba78a479ff764c0aa29e8f97ace"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_widgets" DROP CONSTRAINT "FK_dac539060d0b71bf4aeeb52b205"`,
    );
    await queryRunner.query(
      `ALTER TABLE "base_widgets" DROP CONSTRAINT "FK_ec4ecfd98ca886865a3f579994f"`,
    );
    await queryRunner.query(`DROP TABLE "question_indicator_map"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_survey_answers_question_answer"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_survey_answers_country_code"`,
    );
    await queryRunner.query(`DROP TABLE "survey_answers"`);
    await queryRunner.query(`DROP TABLE "page_filters"`);
    await queryRunner.query(`DROP TABLE "api_events"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "custom_widgets"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_section_widgets_section_order"`,
    );
    await queryRunner.query(`DROP TABLE "base_widgets"`);
    await queryRunner.query(`DROP TABLE "sections"`);
  }
}
