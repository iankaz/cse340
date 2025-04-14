const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const accountValidation = require("../middleware/accountValidation")

// Route to build account management view
router.get("/", 
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildManagement)
)

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to register a new account
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// GET route for account update view
router.get("/update/:account_id", 
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildUpdateView)
)

// POST route for account update
router.post("/update",
  utilities.checkJWTToken,
  accountValidation.validateUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// POST route for password update
router.post("/update-password",
  utilities.checkJWTToken,
  accountValidation.validatePasswordUpdate,
  utilities.handleErrors(accountController.updatePassword)
)

// POST route for assigning roles
router.post("/assign-role",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.assignRole)
)

// Route to process logout
router.get("/logout",
  utilities.handleErrors(accountController.logout)
)

module.exports = router
