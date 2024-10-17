import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialFunctionsAndTriggers1729164610693
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the check_question_indicator_map function
    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION check_question_indicator_map()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Check if the combination exists in the map table
            IF NOT EXISTS (
                SELECT 1 
                FROM question_indicator_map 
                WHERE indicator = NEW.question_indicator AND question = NEW.question
            ) THEN
                RAISE EXCEPTION 'Invalid combination of indicator and question: (''%'' , ''%'')', NEW.question_indicator, NEW.question;
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);

    // Create the trigger for survey_answers to validate the question_indicator and question combination
    await queryRunner.query(`
        DO $$
        BEGIN
            -- Check if the trigger already exists
            IF NOT EXISTS (
                SELECT 1 
                FROM pg_trigger 
                WHERE tgname = 'validate_question_indicator'
            ) THEN
                -- Create the trigger if it doesn't exist
                CREATE TRIGGER validate_question_indicator
                BEFORE INSERT OR UPDATE ON survey_answers
                FOR EACH ROW
                EXECUTE FUNCTION check_question_indicator_map();
            END IF;
        END $$;
      `);

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
        widget_ids int[] := '{}';
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
            id,
            question,
            indicator,
            section_order,
            visualisations,
            default_visualization,
            section_id,
            updated_at,
            created_at
            )
            VALUES (
            (widget->>'id')::int,
            widget->>'question',
            widget->>'indicator',
            (widget->>'section_order')::int,
            widget->>'visualizations',
            (widget->>'default_visualization')::base_widgets_default_visualization_enum,
            p_section_order,
            now(),
            now()
            )
            ON CONFLICT (id) DO UPDATE SET
                "indicator" = EXCLUDED."indicator",
            question = EXCLUDED.question,
            section_order = EXCLUDED.section_order,
            visualisations = EXCLUDED.visualisations,
            default_visualization = EXCLUDED.default_visualization,
            updated_at = now();

            widget_ids := array_append(widget_ids, (widget->>'id')::int);
        END LOOP;

        -- RAISE NOTICE 'Widget IDs: %', widget_ids;

        -- Delete uwanted widgets
        DELETE FROM base_widgets
            WHERE section_id = p_section_order
            AND id NOT IN (SELECT unnest(widget_ids));
        END;
        $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the validate_question_indicator trigger
    await queryRunner.query(`
        DROP TRIGGER IF EXISTS validate_question_indicator ON survey_answers;
    `);

    // Drop the check_question_indicator_map function
    await queryRunner.query(`
        DROP FUNCTION IF EXISTS check_question_indicator_map;
    `);

    await queryRunner.query(
      'DROP FUNCTION IF EXISTS upsert_section_with_widgets;',
    );
  }
}
