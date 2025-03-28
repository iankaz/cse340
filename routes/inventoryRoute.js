// routes/inventoryRoute.js
const express = require("express");
const router = express.Router(); // You can use express.Router() instead of 'new express.Router()'
const invController = require("../controllers/invController");
const validationRules = require("../utilities/classification-validation");
const inventoryValidation = require("../utilities/inventory-validation");
const utilities = require("../utilities");

// Route for inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route for inventory detail view
router.get("/detail/:inv_id", invController.buildDetail);

// Route to inventory management view
router.get("/", utilities.handleErrors(invController.getManagement))

// Route to display the add classification form
router.get("/add-classification", utilities.handleErrors(invController.getAddClassification));

// Route to handle the classification form submission
router.post(
  "/add-classification",
  validationRules.classificationRules(),
  validationRules.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to display add inventory form
router.get("/add-inventory", utilities.handleErrors(invController.getAddInventory))

// Route to process add inventory
router.post(
  "/add-inventory",
  inventoryValidation.inventoryRules(),
  inventoryValidation.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router;
