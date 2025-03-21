// inventory-model.js
const { Pool } = require("pg");
require("dotenv").config();

let pool;
if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        console.log("executed query", { text });
        return res;
      } catch (error) {
        console.error("error in query", { text });
        throw error;
      }
    },
  };
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  module.exports = pool;
}

// Additional functions
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

async function getInventory() {
  return await pool.query("SELECT * FROM public.inventory");
}

async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error);
    throw error;
  }
}

// NEW: Get one inventory item by its ID
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows.length ? data.rows[0] : null;
  } catch (error) {
    console.error("getInventoryById error: ", error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  getInventory,
  getInventoryByClassificationId,
  getInventoryById,
};
