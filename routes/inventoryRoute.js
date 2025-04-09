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
router.get("/", utilities.handleErrors(invController.buildManagementView))  // Changed from getManagement to buildManagementView

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

// Route to get inventory JSON data
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit inventory view
router.get("/edit/:invId", 
  utilities.handleErrors(invController.buildEditInventoryView)
)

// Route to process the inventory update
router.post(
  "/update/",
  inventoryValidation.inventoryRules(),
  inventoryValidation.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Route to build delete confirmation view
router.get("/delete/:invId", 
  utilities.handleErrors(invController.buildDeleteConfirmationView)
)

// Route to process the inventory deletion
router.post(
  "/delete/",
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;
