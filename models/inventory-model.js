const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items
 * ************************** */
async function getInventory(){
  return await pool.query("SELECT * FROM public.inventory")
}

module.exports = {getClassifications, getInventory} 