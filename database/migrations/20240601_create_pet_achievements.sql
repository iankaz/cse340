-- Migration script to create pet_achievements table
CREATE TABLE pet_achievements
(
    achievement_id SERIAL PRIMARY KEY,
    pet_id INTEGER NOT NULL,
    achievement_name VARCHAR(255) NOT NULL,
    date_earned TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_pet FOREIGN KEY (pet_id)
        REFERENCES pets (pet_id)
        ON DELETE CASCADE
);
