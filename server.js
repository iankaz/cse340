// server.js
const session = require("express-session")
const pool = require('./database/')
const express = require("express");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const expressLayouts = require("express-ejs-layouts");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const utilities = require("./utilities/index");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser())

// JWT Token checking
app.use(utilities.checkJWTToken)

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Set EJS as the view engine and configure layouts
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Global middleware: Fetch navigation for every view
app.use(async (req, res, next) => {
  res.locals.nav = (await utilities.getNav()) || [];
  next();
});

// Routes
app.use(static);
app.use(express.static("public"));

// Home route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes (including detail view)
app.use("/inv", inventoryRoute);

// Account routes
app.use("/account", accountRoute);

// Catch-all 404 route (must be last)
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

// Express error-handling middleware (placed last)
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const message = err.status === 404
    ? err.message
    : "Oh no! There was a crash. Maybe try a different route?";
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

// Server information from the .env file
const port = process.env.PORT;
const host = process.env.HOST;

// Server startup with port handling
const startServer = () => {
  const basePort = process.env.PORT || 5500;
  let currentPort = basePort;
  const maxAttempts = 10;

  const tryPort = (attempt) => {
    if (attempt >= maxAttempts) {
      console.error('Could not find an available port after', maxAttempts, 'attempts');
      process.exit(1);
    }

    const server = app.listen(currentPort)
      .on('listening', () => {
        console.log(`Server running on ${host}:${currentPort}`);
      })
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${currentPort} is busy, trying ${currentPort + 1}`);
          currentPort++;
          server.close();
          tryPort(attempt + 1);
        } else {
          console.error('Server error:', err);
          process.exit(1);
        }
      });
  };

  tryPort(0);
};

// Start the server
startServer();
