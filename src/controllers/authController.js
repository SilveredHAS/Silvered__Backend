const passport = require("passport");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const request = require("request");
const { GenerateSixDigitOTP } = require("../utils/generateOtp");
const { SetOTPInactiveAfterFiveMinutes } = require("../utils/setOTPTimeout");
const OTPRegister = require("../models/otpRegister");
const CryptoJS = require("crypto-js");

// Controller function for Google authentication callback
const loginAuthentication = (req, res, next) => {
  try {
    console.log("Inside loginAuthentication function in authController.js");
    console.log("Reqbody is ", req.body);
    const loginType = req.body.type;

    if (loginType === "password") {
      console.log("Inside loginType password");
      passport.authenticate("custom-local", async (err, user, info) => {
        if (err) {
          return res.status(500).json({ message: "Internal server error" });
        } else if (
          info.message ===
            "The entered Mobile do not exist. Please Sign up into Silvered" ||
          info.message === "Please enter correct mobile number and Password"
        ) {
          return res.status(401).json({ message: info.message });
        } else if (info.message === "Login Successfull") {
          const { mobileNumber } = req.body;
          const user = await User.findOne({ mobileNumber });
          console.log("Req is ", req.user);
          console.log("Req is ", req.isAuthenticated());
          console.log("Req is ", req.session);
          req.session.user = {
            isAuthenticated: true,
            fullName: user.fullName,
            mobileNumber: user.mobileNumber,
            cartLength: user.cart.length,
          };
          console.log("Session data after user login is ", req.session);
          return res
            .status(200)
            .json({ message: info.message, userDetails: req.session.user });
        } else {
          return res.status(500).json({ message: "Login failed" });
        }
      })(req, res, next);
    } else if (loginType === "otp") {
      console.log("Inside loginType otp");
      passport.authenticate("custom-otp", async (err, user, info) => {
        console.log(err);
        console.log(info);
        if (err) {
          console.log("error inside custom otp and error is ", err);
          return res.status(500).json({ message: "Internal server error" });
        } else if (
          info.message ===
            "The entered Mobile do not exist. Please Sign up into Silvered" ||
          info.message === "OTP Expired! Please generate new otp to continue" ||
          info.message === "Incorrect OTP! Please enter correct OTP."
        ) {
          return res.status(401).json({ message: info.message });
        } else if (info.message === "OTP Verified Successfully") {
          const { mobileNumber } = req.body;
          const user = await User.findOne({ mobileNumber });
          req.session.user = {
            isAuthenticated: true,
            fullName: user.fullName,
            mobileNumber: user.mobileNumber,
            cartLength: user.cart.length,
          };
          console.log("Session data after user login is ", req.session);
          return res
            .status(200)
            .json({ message: info.message, userDetails: req.session.user });
        } else {
          return res.status(500).json({ message: "Login failed" });
        }
      })(req, res, next);
    }
  } catch (error) {
    console.log("Login Failed");
    console.log(error);
    res.status(500).json({ message: "Login Failed" });
  }
};

const registerAuthentication = async (req, res) => {
  try {
    const { fullName, mobileNumber, password } = req.body;
    console.log("Req body of verify otp and register is ", req.body);

    // Now create the new user account
    const hashedPassword = await bcrypt.hash(password, 15);
    console.log("Hashed Password is ", hashedPassword);
    const user = new User({
      fullName,
      mobileNumber,
      password: hashedPassword,
    });
    await user.save();
    console.log("Account created successfully!");

    req.session.user = {
      isAuthenticated: true,
      fullName: fullName,
      mobileNumber: mobileNumber,
      cartLength: 0,
    };
    console.log("Session data after user login is ", req.session);
    return res.status(200).json({
      message: "Registered successfully!",
      userDetails: req.session.user,
    });
  } catch (error) {
    console.log("Registration Failed:", error);
    res.status(500).json({ message: "Registration Failed" });
  }
};

const checkValidMobileNumber = async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    console.log("Inside checkValidMobileNumber route handler");
    console.log("Req Body is ", req.body);

    // Check if the email or mobile number already exists in the database
    const existingUser = await User.findOne({ mobileNumber });

    if (existingUser) {
      console.log("User account already exists");
      return res.status(200).json({
        isValid: true,
      });
    } else {
      return res.status(200).json({
        isValid: false,
      });
    }
  } catch (error) {
    console.log("Mobile Verification Failed");
    console.log(error);
    res.status(500).json({ message: "Mobile Verification failed" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    console.log("Req body of verifyOtp is ", req.body);
    const { mobileNumber, otp } = req.body;
    const user = await OTPRegister.findOne({ mobileNumber });
    console.log("User in verifyOtp controller is ", user);
    const otpFromDb = user.otp;
    if (user.isOtpActive === false) {
      console.log("OTP Expired! Please generate new otp to continue");
      return res.status(200).json({
        isVerified: false,
        message: "OTP Expired! Please generate new otp to continue",
      });
    } else if (otpFromDb === otp) {
      console.log("OTP Verified Successfully");
      const user = await User.findOne({ mobileNumber });
      console.log("User is ", user);
      const userDetails = {
        fullName: user ? user.fullName : "",
        mobileNumber: user ? user.mobileNumber : "",
      };
      req.session.user = {
        fullName: userDetails.fullName,
        mobileNumber: userDetails.mobileNumber,
        // Other user-related information
      };
      console.log("Session data after verifying otp is ", req.session);
      SetOTPInactiveAfterFiveMinutes(otp, mobileNumber, 1500);
      return res.status(200).json({
        isVerified: true,
        message: "OTP Verified Successfully",
        userDetails,
      });
    } else {
      console.log("Incorrect OTP! Please enter correct OTP.");
      return res.status(200).json({
        isVerified: false,
        message: "Incorrect OTP! Please enter correct OTP.",
      });
    }
  } catch (error) {
    console.log("Error : Verify OTP Failed:", error);
    return res.status(500).json({ message: "Verify OTP Failed" });
  }
};

const logoutUser = (req, res) => {
  console.log("In logout function, req is ", req);
  console.log("In logout function, session data is ", req.session);
  // req.session.user.isAuthenticated = false;
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).json({ message: "Logging Out failed" });
    } else {
      console.log("Logged Out Successfully!");
      console.log(
        "In logout function, after logging out, session data is ",
        req.session
      );
      res.status(200).json({ message: "Logged Out Successfully!" });
    }
  });
};

const checkCurrentUser = (req, res) => {
  console.log("Inside CheckCurrent User and Session data is ", req.session);
  if (req.session && req.session.user && req.session.user.isAuthenticated) {
    // If the user is authenticated, send their details
    console.log("The user is Authenticated");
    res.status(200).json({ userDetails: req.session.user });
  } else {
    // If the user is not authenticated, send an empty object or an appropriate response
    console.log("The user is not Authenticated");
    res.status(401).json({ userDetails: null });
  }
};

const sendOTP = async (req, res) => {
  try {
    console.log("Inside sendOTP route controller");
    const { mobileNumber } = req.body;
    console.log("Mobile Number from frontend is ", mobileNumber);
    const otp = GenerateSixDigitOTP();
    console.log("Generated OTP is ", otp);
    const updateOtp = await OTPRegister.findOneAndUpdate(
      { mobileNumber }, // Search criteria
      {
        otp,
        isOtpActive: true,
      },
      { upsert: true, new: true } // Upsert option to create if not found
    );

    console.log("OTP saved in db successfully ");
    SetOTPInactiveAfterFiveMinutes(otp, mobileNumber);

    const options = {
      method: "GET",
      url: `https://api.authkey.io/request?authkey=665dfb34d6f620d9&mobile=${mobileNumber}&country_code=91&sid=10995&name=Silvered&otp=${otp}&company=Silvered Account`,
    };

    request(options, function (error, response, body) {
      console.log("Response Body is");
      console.log(response);
      console.log(response.body);
      if (error) {
        console.log("Error while sending OTP");
        return res.status(500).json({
          isSuccess: false,
        });
      }
      if (response.body.includes("Submitted Successfully")) {
        console.log("OTP Sent Successfully!");
        return res.status(200).json({
          isSuccess: true,
        });
      } else {
        console.log("Could not send OTP");
        return res.status(200).json({
          isSuccess: false,
        });
      }
    });
  } catch (error) {
    console.log("Send OTP Failed");
    console.log(error);
    res.status(500).json({ message: "Error while sending OTP" });
  }
};

const updatePassword = async (req, res) => {
  try {
    console.log("Inside update Password route controller");
    const { mobileNumber, password } = req.body;
    console.log("Req body is ", req.body);
    const user = await User.findOne({ mobileNumber });

    if (!user) {
      return res
        .status(200)
        .json({ isSuccess: false, message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(password, 15);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ isSuccess: true, message: "Password updated successfully" });
  } catch (error) {
    console.log("Update Password Failed");
    console.log(error);
    return res
      .status(500)
      .json({ isSuccess: false, message: "Password update failed" });
  }
};

module.exports = {
  loginAuthentication,
  registerAuthentication,
  verifyOtp,
  logoutUser,
  checkCurrentUser,
  sendOTP,
  checkValidMobileNumber,
  updatePassword,
};
