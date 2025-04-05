const { body, validationResult } = require("express-validator")
const utilities = require(".")
const invModel = require("../models/inventory-model")

const validate = {}

validate.inventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Please select a classification"),
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the vehicle make"),
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the vehicle model"),
    body("inv_year")
      .isInt({ min: 1900, max: 2024 })
      .withMessage("Please provide a valid year between 1900 and 2024"),
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a description"),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price"),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Please provide valid mileage"),
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a color"),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav: await utilities.getNav(),
      classificationList,
      ...req.body // Makes form sticky
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to edit inventory item
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { 
    inv_id,
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id 
  } = req.body

  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/edit-inventory", {
      title: "Edit " + itemData.inv_make + " " + itemData.inv_model,
      nav,
      classificationSelect,
      errors: errors.array(),
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
    return
  }
  next()
}

module.exports = validate
