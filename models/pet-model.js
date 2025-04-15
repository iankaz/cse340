// models/pet-model.js
const pool = require("../database/");

async function getPetByAccountId(accountId) {
  const sql = "SELECT * FROM pets WHERE account_id = $1";
  const values = [accountId];
  const result = await pool.query(sql, values);
  return result.rows[0];
}

async function getPetsByAccountId(accountId) {
  const sql = "SELECT * FROM pets WHERE account_id = $1 ORDER BY pet_id";
  const values = [accountId];
  const result = await pool.query(sql, values);
  return result.rows;
}

async function createPet(accountId, petName) {
  const sql = `
    INSERT INTO pets (account_id, pet_name, level, hunger, happiness, last_fed, last_played)
    VALUES ($1, $2, 1, 50, 50, NOW(), NOW())
    RETURNING *;
  `;
  const values = [accountId, petName];
  const result = await pool.query(sql, values);
  return result.rows[0];
}

async function getPetById(petId) {
  const sql = "SELECT * FROM pets WHERE pet_id = $1";
  const values = [petId];
  const result = await pool.query(sql, values);
  return result.rows[0];
}

async function feedPet(petId) {
  const sql = `
    UPDATE pets
    SET hunger = GREATEST(hunger - 10, 0),
        last_fed = NOW(),
        updated_at = NOW()
    WHERE pet_id = $1
    RETURNING *;
  `;
  const values = [petId];
  const result = await pool.query(sql, values);
  return result.rows[0];
}

async function playWithPet(petId) {
  const sql = `
    UPDATE pets
    SET happiness = LEAST(happiness + 10, 100),
        last_played = NOW(),
        updated_at = NOW()
    WHERE pet_id = $1
    RETURNING *;
  `;
  const values = [petId];
  const result = await pool.query(sql, values);
  return result.rows[0];
}

async function levelUpPet(petId) {
  const sql = `
    UPDATE pets
    SET level = level + 1,
        updated_at = NOW()
    WHERE pet_id = $1
    RETURNING *;
  `;
  const values = [petId];
  const result = await pool.query(sql, values);
  return result.rows[0];
}

async function renamePet(petId, newName) {
  const sql = `
    UPDATE pets
    SET pet_name = $2,
        updated_at = NOW()
    WHERE pet_id = $1
    RETURNING *;
  `;
  const values = [petId, newName];
  const result = await pool.query(sql, values);
  return result.rows[0];
}

async function putPetToSleep(petId) {
  // Example interaction: reset happiness to 100 and update updated_at
  const sql = `
    UPDATE pets
    SET happiness = 100,
        updated_at = NOW()
    WHERE pet_id = $1
    RETURNING *;
  `;
  const values = [petId];
  const result = await pool.query(sql, values);
  return result.rows[0];
}

module.exports = {
  getPetByAccountId,
  getPetsByAccountId,
  createPet,
  getPetById,
  feedPet,
  playWithPet,
  levelUpPet,
  renamePet,
  putPetToSleep,
};
