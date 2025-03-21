// routes/inventoryRoute.js
const express = require("express");
const router = express.Router(); // You can use express.Router() instead of 'new express.Router()'
const invController = require("../controllers/invController");

// Route for inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route for inventory detail view
router.get("/detail/:inv_id", invController.buildDetail);

module.exports = router;
