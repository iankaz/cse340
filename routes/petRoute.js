// routes/petRoute.js
const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");
const utilities = require("../utilities/index");

// Protect all pet routes with login check middleware
router.use(utilities.checkLogin);

// Route to view the pet
router.get("/", petController.viewPet);

// Route to feed the pet
router.post("/feed", petController.feedPet);

// Route to play with the pet
router.post("/play", petController.playWithPet);

// Route to level up the pet
router.post("/levelup", petController.levelUpPet);

// Route to rename the pet
router.post("/rename", petController.renamePet);

// Route to put the pet to sleep
router.post("/sleep", petController.putPetToSleep);

module.exports = router;
