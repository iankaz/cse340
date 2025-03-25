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

/* ****************************************
*  Deliver management view
**************************************** */
invCont.getManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const title = "Vehicle Management"
  res.render("./inventory/management", {
    title,
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver classification view
**************************************** */
invCont.getAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Add Classification
**************************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  
  const result = await invModel.addClassification(classification_name)
  
  if (result) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    )
    let nav = await utilities.getNav()
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav: await utilities.getNav(),
      errors: null,
    })
  }
}

/* ****************************************
*  Deliver Add Inventory View
**************************************** */
invCont.getAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
  })
}

/* ****************************************
*  Process Add Inventory
**************************************** */
invCont.addInventory = async function (req, res) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body

  const result = await invModel.addInventory({
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  })

  if (result === "duplicate") {
    req.flash("notice", "Sorry, this vehicle already exists in the inventory.")
    const classificationList = await utilities.buildClassificationList(classification_id)
    res.status(409).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav: await utilities.getNav(),
      classificationList,
      errors: null,
      ...req.body // Keep form sticky
    })
    return
  }

  if (result) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`)
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav: await utilities.getNav(),
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the vehicle failed.")
    const classificationList = await utilities.buildClassificationList(classification_id)
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav: await utilities.getNav(),
      classificationList,
      errors: null,
      ...req.body // Spread operator to make form sticky
    })
  }
}

module.exports = invCont;
