// routes/inventoryRoute.js
const express = require("express");
const router = express.Router(); // You can use express.Router() instead of 'new express.Router()'
const invController = require("../controllers/invController");
const validationRules = require("../utilities/classification-validation");
const inventoryValidation = require("../utilities/inventory-validation");
const utilities = require("../utilities");
const { checkInventoryAuth } = require("../middleware/inventoryAuth");

// Public routes (no authorization required)
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inv_id", invController.buildDetail);

// Protected routes (require Employee or Admin authorization)
router.get("/", 
  checkInventoryAuth,
  utilities.handleErrors(invController.buildManagementView)
);

router.get("/add-classification", 
  checkInventoryAuth,
  utilities.handleErrors(invController.getAddClassification)
);

router.post(
  "/add-classification",
  checkInventoryAuth,
  validationRules.classificationRules(),
  validationRules.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

router.get("/add-inventory", 
  checkInventoryAuth,
  utilities.handleErrors(invController.getAddInventory)
);

router.post(
  "/add-inventory",
  checkInventoryAuth,
  inventoryValidation.inventoryRules(),
  inventoryValidation.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

router.get("/getInventory/:classification_id", 
  checkInventoryAuth,
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get("/edit/:invId", 
  checkInventoryAuth,
  utilities.handleErrors(invController.buildEditInventoryView)
);

router.post(
  "/update/",
  checkInventoryAuth,
  inventoryValidation.inventoryRules(),
  inventoryValidation.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

router.get("/delete/:invId", 
  checkInventoryAuth,
  utilities.handleErrors(invController.buildDeleteConfirmationView)
);

router.post(
  "/delete/",
  checkInventoryAuth,
  utilities.handleErrors(invController.deleteInventory)
);

// Shopping cart routes
router.get("/cart", invController.viewCart);
router.post("/cart/add", invController.addToCart);
router.post("/cart/remove", invController.removeFromCart);


module.exports = router;
