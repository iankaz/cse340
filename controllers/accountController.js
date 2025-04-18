const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Deliver account management view
 * *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
 * Deliver account update view
 * *************************************** */
async function buildUpdateView(req, res, next) {
  try {
    let nav = await utilities.getNav()
    const account_id = req.params.account_id
    const accountData = await accountModel.getAccountById(account_id)
    
    if (!accountData) {
      req.flash("notice", "Account not found")
      return res.redirect("/account/")
    }

    res.render("account/update", {
      title: "Update Account",
      nav,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id: accountData.account_id,
      errors: null
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
    return
  }

  const regResult = await accountModel.accountRegister(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      // Remove sensitive data before creating token
      const tokenData = {
        account_id: accountData.account_id,
        account_type: accountData.account_type,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email
      }
      
      // Create JWT token
      const accessToken = jwt.sign(
        tokenData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      )

      // Set cookie with token
      res.cookie("jwt", accessToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 * 1000, // 1 hour
        sameSite: 'strict'
      })

      // Set success message and redirect
      req.flash("notice", `Welcome back, ${accountData.account_firstname}!`)
      return res.redirect("/account/")
    }
  } catch (error) {
    console.error('Login error:', error)
    return res.status(403).render("account/login", {
      title: "Login",
      nav,
      errors: ['Access Forbidden'],
      account_email,
    })
  }
  
  // If we get here, password didn't match
  req.flash("notice", "Please check your credentials and try again.")
  res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
  })
}

/* ***************************
 * Process logout request
 * ************************** */
async function logout(req, res, next) {
  try {
    // Clear the JWT token cookie
    res.clearCookie("jwt")
    
    // Set flash message
    req.flash("notice", "You have been successfully logged out.")
    
    // Redirect to home view
    res.redirect("/")
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * Assign Role to Account
 * *************************************** */
async function assignRole(req, res) {
  const { account_id, role } = req.body;

  const result = await accountModel.assignRole(account_id, role);
  if (result) {
    req.flash("notice", "Role assigned successfully.");
    return res.redirect("/account/management");
  } else {
    req.flash("notice", "Failed to assign role.");
    return res.redirect("/account/management");
  }
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  buildManagement, 
  buildUpdateView, 
  registerAccount, 
  accountLogin, 
  logout,
  assignRole
}
