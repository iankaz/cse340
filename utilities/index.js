const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************ */
Util.getNav = async function () {
  // Fetch classification data from the inventory model
  let data = await invModel.getClassifications();
  let list = "<ul>"; // Begin the unordered list

  // Add a Home link
  list += '<li><a href="/" title="Home page">Home</a></li>';

  // Dynamically generate links for each classification
  data.rows.forEach((row) => {
    list += "<li>";
    list += `<a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>`;
    list += "</li>";
  });

  list += "</ul>"; // Close the unordered list
  return list; // Return the constructed HTML
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
 * Build the classification view HTML
 ************************************** */
Util.buildClassificationGrid = async function (data) {
  let grid;

  // Check if data contains vehicles
  if (data.length > 0) {
    grid = '<ul id="inv-display">'; // Begin the unordered grid list
    data.forEach((vehicle) => {
      grid += "<li>";
      grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details"><img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" /></a>`;
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">${vehicle.inv_make} ${vehicle.inv_model}</a>`;
      grid += "</h2>";
      grid += `<span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>`;
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>"; // Close the unordered list
  } else {
    // Show a message if no vehicles match
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  return grid; // Return the constructed grid HTML
};

module.exports = Util;
