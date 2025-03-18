const utilities = require("../utilities/")
const baseController = {}

/* *************************
 * Build Home View
 * *************************/
baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

/* ****************************************
* Deliver error 500 view
* *************************************** */
baseController.buildError = async function(req, res){
  const nav = await utilities.getNav()
  res.render("errors/error", {
    title: "Server Error",
    nav,
    message: "Sorry, the server experienced an error.",
  })
}

module.exports = baseController 