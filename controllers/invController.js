// controllers/invController.js
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/index");

const invCont = {};

// Function to build inventory by classification view
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classificationId = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classificationId);
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    // Assuming you have relevant classification_name in your data:
    const className = data[0]?.classification_name || "Vehicles";
    res.render("inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

// Function to build detail view for a specific inventory item
invCont.buildDetail = async function (req, res, next) {
  try {
    const invId = req.params.inv_id;
    const data = await invModel.getInventoryById(invId);

    if (!data) {
      return next({ status: 404, message: "No inventory item found." });
    }

    const detailHTML = await utilities.buildVehicleDetail(data);
    res.render("inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav: await utilities.getNav(),
      detail: detailHTML,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
