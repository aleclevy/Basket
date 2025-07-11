CREATE DATABASE basket_db;

\c basket_db;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    category VARCHAR(100),
    active_date DATE UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE responses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    response_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, question_id)
);

CREATE TABLE response_matches (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    response_id INTEGER REFERENCES responses(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, response_id)
);

CREATE INDEX idx_questions_active_date ON questions(active_date);
CREATE INDEX idx_responses_user_id ON responses(user_id);
CREATE INDEX idx_responses_question_id ON responses(question_id);
CREATE INDEX idx_response_matches_user_id ON response_matches(user_id);

-- Insert some sample questions
INSERT INTO questions (question_text, category, active_date) VALUES
('What made you smile today?', 'gratitude', CURRENT_DATE),
('What is one thing you are grateful for right now?', 'gratitude', CURRENT_DATE + INTERVAL '1 day'),
('How are you feeling about your relationships today?', 'relationships', CURRENT_DATE + INTERVAL '2 days'),
('What is one challenge you overcame recently?', 'growth', CURRENT_DATE + INTERVAL '3 days'),
('What helps you feel grounded when things get tough?', 'coping', CURRENT_DATE + INTERVAL '4 days');