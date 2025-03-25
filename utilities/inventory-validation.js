const { body, validationResult } = require("express-validator")
const utilities = require(".")

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

module.exports = validate
