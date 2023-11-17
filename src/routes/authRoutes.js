const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/user");

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/home",
    failureRedirect: "http://localhost:3000/login",
    failureFlash: true,
  })
);

// email password auth
router.post("/auth/login", (req, res, next) => {
  passport.authenticate("custom-local", (err, user, info) => {
    console.log("Error is ", err);
    console.log("Info is ", info);
    console.log("User is ", user);
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    if (
      info.message ===
        "The entered Email/Mobile do not exist. Please Sign up into Silvered" ||
      info.message === "Please enter correct Email/Mobile and Password"
    ) {
      console.log("Authentication failed");
      return res.status(401).json({ message: info.message });
    }
    if (info.message === "Login Successfull") {
      console.log("Logged In Successfully!");
      return res.status(200).json({ message: info.message });
    } else {
      console.log("Login Failed");
      return res.status(500).json({ message: "Login failed" });
    }
  })(req, res, next);
});

router.post("/auth/register", async (req, res) => {
  try {
    const { fullName, mobileNumber, email, password } = req.body;
    console.log("Inside auth/register route");
    console.log("Req Body is ", req.body);

    // Check if the email or mobile number already exists in the database
    const existingUser = await User.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    if (existingUser) {
      console.log("User account already exists");
      return res
        .status(409)
        .json({
          message:
            "User account already exists. Please sign in to your account",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 15);
    console.log("Hashed Password is ", hashedPassword);
    const user = new User({
      fullName,
      mobileNumber,
      email,
      password: hashedPassword,
    });
    await user.save();
    console.log("Registered Successfully!");
    res.status(200).json({ message: "Registered Successfully!" });
  } catch (error) {
    console.log("Registration Failed");
    console.log(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (!err) {
      // Logout was successful
      console.log("Logged Out Successfully!");
      res.status(200).json({ message: "Logged Out Successfully!" });
    } else {
      console.log("Logging Out Failed");
      console.log(error);
      res.status(500).json({ message: "Logging Out failed" });
    }
  });
});

// Enable CORS
router.get("/curr-user", (req, res) => {
  if (req.isAuthenticated()) {
    // If the user is authenticated, send their details
    console.log("The user is Authenticated");
    res.json({ message: req.user });
  } else {
    // If the user is not authenticated, send an empty object or an appropriate response
    console.log("The user is not Authenticated");
    res.json({ message: "Unauthorized" });
  }
});

module.exports = router;
