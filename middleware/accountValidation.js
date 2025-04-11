const accountModel = require("../models/account-model")
const utilities = require("../utilities/")

/* ***************************
 * Validate account update data
 * ************************** */
async function validateUpdateData(req, res, next) {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = []

  // Check if required fields are present
  if (!account_firstname) errors.push("First name is required")
  if (!account_lastname) errors.push("Last name is required")
  if (!account_email) errors.push("Email is required")

  // Validate first and last name format
  const nameRegex = /^[A-Za-z\s]{1,}$/
  if (account_firstname && !nameRegex.test(account_firstname)) {
    errors.push("First name must contain only letters and spaces")
  }
  if (account_lastname && !nameRegex.test(account_lastname)) {
    errors.push("Last name must contain only letters and spaces")
  }

  // Check if email is being changed
  const currentAccount = await accountModel.getAccountById(account_id)
  if (currentAccount && currentAccount.account_email !== account_email) {
    // Check if new email already exists
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists) {
      errors.push("Email already exists. Please use a different email address.")
    }
  }

  if (errors.length > 0) {
    req.flash("notice", errors)
    res.locals.account_firstname = account_firstname
    res.locals.account_lastname = account_lastname
    res.locals.account_email = account_email
    res.locals.account_id = account_id
    return res.render("account/update", {
      title: "Update Account",
      errors
    })
  }
  next()
}

/* ***************************
 * Validate password update
 * ************************** */
async function validatePasswordUpdate(req, res, next) {
  const { account_password, account_id } = req.body
  let errors = []

  // Check if password meets requirements
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}$/
  if (!passwordRegex.test(account_password)) {
    errors.push("Password must be at least 12 characters and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character")
  }

  if (errors.length > 0) {
    req.flash("notice", errors)
    res.locals.account_id = account_id
    return res.render("account/update", {
      title: "Update Account",
      errors
    })
  }
  next()
}

module.exports = {
  validateUpdateData,
  validatePasswordUpdate
} 