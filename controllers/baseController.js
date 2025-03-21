// controllers/baseController.js
const utilities = require("../utilities/index");

const baseController = {};

/* Existing home builder function */
baseController.buildHome = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("index", { title: "Home", nav });
  } catch (error) {
    next(error);
  }
};

/* NEW: Intentional Error Trigger for testing 500 errors */
baseController.throwTestError = async function (req, res, next) {
  // Create an intentional error to trigger the error middleware
  next(new Error("Intentional test error triggered."));
};

module.exports = baseController;
