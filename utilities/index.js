// utilities/index.js
const invModel = require("../models/inventory-model");

const Util = {};

// Build the navigation HTML dynamically
Util.getNav = async function () {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list += `<a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>`;
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

// Middleware for wrapping asynchronous route handlers
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Build classification grid (for listing view)
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li>';
      grid += `<a href="/inv/detail/${vehicle.inv_id}" class="vehicle-link" aria-label="View details for ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}"></a>`;
      grid += `<img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}" />`;
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += `<h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>`;
      grid += `<span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>`;
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* ************************
 * Build the classification select list
 ************************** */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

// Build the vehicle detail HTML for the detail view
Util.buildVehicleDetail = async function (vehicle) {
  let detail = `<div class="vehicle-detail-container">`;
  // Image section: Use the full-size image (assumed field name "inv_image")
  detail += `<div class="vehicle-detail-image">
               <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
             </div>`;
  // Information section: Display make, model, year, price, mileage, and description
  detail += `<div class="vehicle-detail-info">
               <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
               <p><strong>Year:</strong> ${vehicle.inv_year}</p>
               <p><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>
               <p><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles</p>
               <p><strong>Description:</strong> ${vehicle.inv_description}</p>
             </div>`;
  detail += `</div>`;
  return detail;
};

module.exports = Util;
