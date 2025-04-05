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

/* **********************
 *   Add New Classification
 * ********************* */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    const result = await pool.query(sql, [classification_name])
    return result.rowCount > 0
  } catch (error) {
    console.error("addClassification error " + error)
    return false
  }
}

/* **********************
 *   Add New Inventory Item
 * ********************* */
async function addInventory(inventoryData) {
  try {
    // First check if vehicle with same make and model exists
    const checkSql = `
      SELECT * FROM inventory 
      WHERE inv_make = $1 
      AND inv_model = $2
      AND classification_id = $3`
    
    const checkResult = await pool.query(checkSql, [
      inventoryData.inv_make,
      inventoryData.inv_model,
      inventoryData.classification_id
    ])

    if (checkResult.rowCount > 0) {
      return "duplicate"
    }

    const sql = `
      INSERT INTO inventory (
        classification_id, inv_make, inv_model, 
        inv_year, inv_description, inv_image, 
        inv_thumbnail, inv_price, inv_miles, 
        inv_color
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`
    
    const values = [
      inventoryData.classification_id,
      inventoryData.inv_make,
      inventoryData.inv_model,
      inventoryData.inv_year,
      inventoryData.inv_description,
      inventoryData.inv_image,
      inventoryData.inv_thumbnail,
      inventoryData.inv_price,
      inventoryData.inv_miles,
      inventoryData.inv_color
    ]

    const result = await pool.query(sql, values)
    return result.rowCount > 0
  } catch (error) {
    console.error("addInventory error " + error)
    return false
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

module.exports = {
  getClassifications,
  getInventory,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
  updateInventory,
};
