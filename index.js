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

// Define the Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "750398454345-8h9gmqe9d3usk892jspaanv7ldng43a7.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle user data here
      // Typically, you'd save user data to your database or perform other actions.
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user (used for session management)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Define routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:3000/home"); // Redirect to your frontend app after successful authentication
  }
);

app.get("/logout", (req, res) => {
  req.logout(); // Logout the user
  res.redirect("http://localhost:3000"); // Redirect to your frontend app after logout
});

app.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    // If the user is authenticated, send their details
    res.json(req.user);
  } else {
    // If the user is not authenticated, send an empty object or an appropriate response
    res.json({});
  }
});

// Start your server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
