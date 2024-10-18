import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialFunctionsAndTriggers1729164610693
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION upsert_section_with_widgets(
        p_section jsonb,
        p_widgets jsonb
      )
        RETURNS void
        LANGUAGE plpgsql
        AS $$
        DECLARE
        widget jsonb;
        p_section_order int;
        p_slug varchar;
        p_name varchar;
        p_description varchar;
        widget_indicators text[] := '{}';
      BEGIN
        -- Extract section details from the JSON input
        p_section_order := (p_section->>'order')::int;
        p_slug := p_section->>'slug';
        p_name := p_section->>'name';
        p_description := p_section->>'description';

        -- Upsert the section
        INSERT INTO sections ("order", slug, "name", description, created_at)
        VALUES (p_section_order, p_slug, p_name, p_description, now())
        ON CONFLICT ("order") DO UPDATE SET
            slug = EXCLUDED.slug,
            "name" = EXCLUDED."name",
            description = EXCLUDED.description,
            created_at = EXCLUDED.created_at;

        -- Upsert the widgets
        FOR widget IN SELECT * FROM jsonb_array_elements(p_widgets)
        LOOP
            INSERT INTO base_widgets (
              indicator,
              question,
              section_order,
              visualisations,
              default_visualization,
              section_id,
              updated_at,
              created_at
            )
            VALUES (
              widget->>'indicator',
              widget->>'question',
              (widget->>'section_order')::int,
              widget->>'visualizations',
              (widget->>'default_visualization')::base_widgets_default_visualization_enum,
              p_section_order,
              now(),
              now()
            )
            ON CONFLICT ("indicator") DO UPDATE SET
              question = EXCLUDED.question,
              section_order = EXCLUDED.section_order,
              visualisations = EXCLUDED.visualisations,
              default_visualization = EXCLUDED.default_visualization,
              updated_at = now();

            widget_indicators := array_append(widget_indicators, (widget->>'indicator'));
        END LOOP;

        -- RAISE NOTICE 'Widget indicators: %', widget_indicators;

        -- Delete uwanted widgets
        DELETE FROM base_widgets
            WHERE section_id = p_section_order
            AND indicator NOT IN (SELECT unnest(widget_indicators));
      END;
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS upsert_section_with_widgets;',
    );
  }
}
