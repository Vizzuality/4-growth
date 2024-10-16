-- PROVISIONAL MOCK DATA
DROP SCHEMA IF EXISTS "survey" CASCADE;
CREATE SCHEMA "survey";

CREATE TABLE survey.answers (
  survey_id INTEGER
  -- , hierarchy_level_1 VARCHAR(256) -- Section the questions belong to
  , hierarchy_level_2 VARCHAR(256) -- The questions
  -- , hierarchy_level_3 VARCHAR(256)
  , categorical_answer VARCHAR(256)
);

INSERT INTO survey.answers (survey_id, hierarchy_level_2, categorical_answer) VALUES (1, 'Location (Country/Region)', 'Spain');
INSERT INTO survey.answers (survey_id, hierarchy_level_2, categorical_answer) VALUES (2, 'Location (Country/Region)', 'Spain');
INSERT INTO survey.answers (survey_id, hierarchy_level_2, categorical_answer) VALUES (3, 'Location (Country/Region)', 'Spain');
INSERT INTO survey.answers (survey_id, hierarchy_level_2, categorical_answer) VALUES (4, 'Location (Country/Region)', 'France');
INSERT INTO survey.answers (survey_id, hierarchy_level_2, categorical_answer) VALUES (5, 'Location (Country/Region)', 'France');
INSERT INTO survey.answers (survey_id, hierarchy_level_2, categorical_answer) VALUES (1, 'Sector (Agri/Forestry/Both)', 'Agri');
INSERT INTO survey.answers (survey_id, hierarchy_level_2, categorical_answer) VALUES (2, 'Sector (Agri/Forestry/Both)', 'Agri');
INSERT INTO survey.answers (survey_id, hierarchy_level_2, categorical_answer) VALUES (3, 'Sector (Agri/Forestry/Both)', 'Forestry');

-- MIGRATION
-- DROP SCHEMA IF EXISTS "survey" CASCADE;

-- NEW DATA MODEL
DROP TABLE IF EXISTS question_indicator_map;
CREATE TABLE question_indicator_map (
  indicator VARCHAR(256)
  , question VARCHAR(256)
  , PRIMARY KEY (indicator, question)
);

INSERT INTO question_indicator_map (indicator, question) VALUES 
('sector', 'Sector (Agri/Forestry/Both)'),
('eu-member-state', 'Location (Country/Region)');

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


-- DATA
DELETE FROM survey_answers;

INSERT INTO survey_answers (survey_id, question_indicator, question, answer, country_code) VALUES (1, 'eu-member-state', 'Location (Country/Region)', 'Spain', 'ESP');
INSERT INTO survey_answers (survey_id, question_indicator, question, answer, country_code) VALUES (2, 'eu-member-state', 'Location (Country/Region)', 'Spain', 'ESP');
INSERT INTO survey_answers (survey_id, question_indicator, question, answer, country_code) VALUES (3, 'eu-member-state', 'Location (Country/Region)', 'Spain', 'ESP');
INSERT INTO survey_answers (survey_id, question_indicator, question, answer, country_code) VALUES (4, 'eu-member-state', 'Location (Country/Region)', 'France', 'FRA');
INSERT INTO survey_answers (survey_id, question_indicator, question, answer, country_code) VALUES (5, 'eu-member-state', 'Location (Country/Region)', 'France', 'FRA');
INSERT INTO survey_answers (survey_id, question_indicator, question, answer, country_code) VALUES (1, 'sector', 'Sector (Agri/Forestry/Both)', 'Agri', 'ESP');
INSERT INTO survey_answers (survey_id, question_indicator, question, answer, country_code) VALUES (2, 'sector', 'Sector (Agri/Forestry/Both)', 'Agri', 'ESP');
INSERT INTO survey_answers (survey_id, question_indicator, question, answer, country_code) VALUES (3, 'sector', 'Sector (Agri/Forestry/Both)', 'Forestry', 'FRA');