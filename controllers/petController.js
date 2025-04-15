// controllers/petController.js
const petModel = require("../models/pet-model");
const utilities = require("../utilities/index");

const petController = {};

// Display the pet interface with all pets
petController.viewPet = async (req, res) => {
  try {
    const accountId = res.locals.accountData.account_id;
    let pets = await petModel.getPetsByAccountId(accountId);
    if (pets.length === 0) {
      // Create default pets if none exist
      await petModel.createPet(accountId, "Fluffy");
      await petModel.createPet(accountId, "Sparky");
      pets = await petModel.getPetsByAccountId(accountId);
    }
    res.render("pet/index", { title: "Your Virtual Pets", pets });
  } catch (error) {
    console.error("Error in viewPet:", error);
    res.status(500).render("errors/error", { title: "Error", message: "Unable to load pets." });
  }
};

// Feed a pet
petController.feedPet = async (req, res) => {
  try {
    const petId = req.body.petId;
    const pet = await petModel.getPetById(petId);
    if (!pet) {
      return res.status(404).send("Pet not found");
    }
    await petModel.feedPet(petId);
    res.redirect("/pet");
  } catch (error) {
    console.error("Error in feedPet:", error);
    res.status(500).render("errors/error", { title: "Error", message: "Unable to feed pet." });
  }
};

// Play with a pet
petController.playWithPet = async (req, res) => {
  try {
    const petId = req.body.petId;
    const pet = await petModel.getPetById(petId);
    if (!pet) {
      return res.status(404).send("Pet not found");
    }
    await petModel.playWithPet(petId);
    res.redirect("/pet");
  } catch (error) {
    console.error("Error in playWithPet:", error);
    res.status(500).render("errors/error", { title: "Error", message: "Unable to play with pet." });
  }
};

// Level up a pet
petController.levelUpPet = async (req, res) => {
  try {
    const petId = req.body.petId;
    const pet = await petModel.getPetById(petId);
    if (!pet) {
      return res.status(404).send("Pet not found");
    }
    await petModel.levelUpPet(petId);
    res.redirect("/pet");
  } catch (error) {
    console.error("Error in levelUpPet:", error);
    res.status(500).render("errors/error", { title: "Error", message: "Unable to level up pet." });
  }
};

// Rename a pet
petController.renamePet = async (req, res) => {
  try {
    const petId = req.body.petId;
    const newName = req.body.newName;
    const pet = await petModel.getPetById(petId);
    if (!pet) {
      return res.status(404).send("Pet not found");
    }
    await petModel.renamePet(petId, newName);
    res.redirect("/pet");
  } catch (error) {
    console.error("Error in renamePet:", error);
    res.status(500).render("errors/error", { title: "Error", message: "Unable to rename pet." });
  }
};

// Put a pet to sleep (example new interaction)
petController.putPetToSleep = async (req, res) => {
  try {
    const petId = req.body.petId;
    const pet = await petModel.getPetById(petId);
    if (!pet) {
      return res.status(404).send("Pet not found");
    }
    await petModel.putPetToSleep(petId);
    res.redirect("/pet");
  } catch (error) {
    console.error("Error in putPetToSleep:", error);
    res.status(500).render("errors/error", { title: "Error", message: "Unable to put pet to sleep." });
  }
};

module.exports = petController;
