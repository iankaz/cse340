// routes/static.js
const express = require("express");
const router = express.Router();
const baseController = require("../controllers/baseController");

// Existing static file serving configurations (if any)
router.use(express.static("public"));
router.use("/css", express.static(__dirname + "/../public/css"));
router.use("/js", express.static(__dirname + "/../public/js"));
router.use("/images", express.static(__dirname + "/../public/images"));

// NEW: Route to intentionally trigger a 500 error
router.get("/error", baseController.throwTestError);

module.exports = router;
