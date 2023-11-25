const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cors = require("cors");

const app = express();

// Configure sessions
app.use(
  session({ secret: "your-secret-key", resave: true, saveUninitialized: true })
);

// Enable CORS
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Start your server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
