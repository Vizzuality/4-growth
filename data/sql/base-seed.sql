-- This sql file is used to seed the database with some mock data

-- Create mock users
INSERT INTO users (email, password) VALUES 
('user1@example.com', 'password1'),
('user2@example.com', 'password2'),
('user3@example.com', 'password3');

-- Create mock charts
INSERT INTO custom_charts (user_id, name, indicator, type, created_at, updated_at) VALUES 
((SELECT id FROM users WHERE email = 'user1@example.com'), 'Technologies Spain', 'digital_technologies', 'stacked_bar', '2024-06-01', '2024-06-15'),
((SELECT id FROM users WHERE email = 'user2@example.com'), 'Goals and Challenges in Agriculture', 'goals_or_challenges', 'map', '2024-06-01', '2024-06-02'),
((SELECT id FROM users WHERE email = 'user2@example.com'), 'Technologies in France', 'digital_technologies', 'doughnut', '2024-06-01', '2024-06-02'),
((SELECT id FROM users WHERE email = 'user3@example.com'), 'Goals in forestry for Southern Europe', 'goals_or_challenges', 'map', '2024-06-05', '2024-06-16'),
((SELECT id FROM users WHERE email = 'user1@example.com'), 'Technology in agriculture in Spain', 'digital_technologies', 'doughnut', '2024-06-10', '2024-06-17');

-- Create mock filters
INSERT INTO chart_filters (custom_chart_id, attribute, value) VALUES 
((SELECT id FROM custom_charts WHERE name = 'Technologies Spain'), 'country', 'Spain'),
((SELECT id FROM custom_charts WHERE name = 'Goals and Challenges in Agriculture'), 'operational_areas', 'Agriculture'),
((SELECT id FROM custom_charts WHERE name = 'Technologies in France'), 'country', 'France'),
((SELECT id FROM custom_charts WHERE name = 'Technologies in France'), 'operational_areas', 'Agriculture'),
((SELECT id FROM custom_charts WHERE name = 'Technologies in France'), 'technology_types', 'Precision Farming'),
((SELECT id FROM custom_charts WHERE name = 'Goals in forestry for Southern Europe'), 'operational_areas', 'Forestry'),
((SELECT id FROM custom_charts WHERE name = 'Goals in forestry for Southern Europe'), 'country', 'Spain'),
((SELECT id FROM custom_charts WHERE name = 'Goals in forestry for Southern Europe'), 'country', 'Portugal'),
((SELECT id FROM custom_charts WHERE name = 'Goals in forestry for Southern Europe'), 'country', 'Italy'),
((SELECT id FROM custom_charts WHERE name = 'Goals in forestry for Southern Europe'), 'country', 'Greece'),
((SELECT id FROM custom_charts WHERE name = 'Technology in agriculture in Spain'), 'country', 'Spain'),
((SELECT id FROM custom_charts WHERE name = 'Technology in agriculture in Spain'), 'operational_areas', 'Agriculture');