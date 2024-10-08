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