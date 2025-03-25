const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isAlphanumeric()
      .withMessage("Classification name must contain only letters and numbers.")
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name."),
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav: await utilities.getNav(),
      classification_name,
    })
    return
  }
  next()
}

module.exports = validate
