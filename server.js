// server.js
const express = require("express");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const expressLayouts = require("express-ejs-layouts");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/index");

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

// Start the server
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
