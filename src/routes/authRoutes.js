const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication
    res.redirect("http://localhost:3000/home");
  }
);

router.get("/logout", (req, res) => {
  req.logout(); // Logout the user
  res.redirect("http://localhost:3000/home"); // Redirect to your frontend app after logout
});

// Enable CORS
router.get("/curr-user", (req, res) => {
  if (req.isAuthenticated()) {
    // If the user is authenticated, send their details
    res.json({ message: req.user });
  } else {
    // If the user is not authenticated, send an empty object or an appropriate response
    res.json({ message: "Unauthorized" });
  }
});

module.exports = router;
