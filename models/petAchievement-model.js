// models/petAchievement-model.js
const pool = require("../database/");

async function getAchievementsByPetId(petId) {
  const sql = "SELECT * FROM pet_achievements WHERE pet_id = $1 ORDER BY date_earned DESC";
  const values = [petId];
  const result = await pool.query(sql, values);
  return result.rows;
}

async function addAchievement(petId, achievementName) {
  const sql = `
    INSERT INTO pet_achievements (pet_id, achievement_name, date_earned)
    VALUES ($1, $2, NOW())
    RETURNING *;
  `;
  const values = [petId, achievementName];
  const result = await pool.query(sql, values);
  return result.rows[0];
}

module.exports = {
  getAchievementsByPetId,
  addAchievement,
};
