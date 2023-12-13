const passport = require("passport");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const request = require("request");
const { GenerateSixDigitOTP } = require("../utils/generateOtp");
const { SetOTPInactiveAfterFiveMinutes } = require("../utils/setOTPTimeout");

// Controller function for Google authentication callback
const loginAuthentication = (req, res, next) => {
  console.log("Inside loginAuthentication function in authController.js");
  passport.authenticate("custom-local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    if (
      info.message ===
        "The entered Mobile do not exist. Please Sign up into Silvered" ||
      info.message === "Please enter correct mobile number and Password"
    ) {
      return res.status(401).json({ message: info.message });
    }
    if (info.message === "Login Successfull") {
      return res.status(200).json({ message: info.message });
    } else {
      return res.status(500).json({ message: "Login failed" });
    }
  })(req, res, next);
};

const emailRegisterAuthentication = async (req, res) => {
  try {
    const { mobileNumber, email } = req.body;
    console.log("Inside auth/register route");
    console.log("Req Body is ", req.body);

    // Check if the email or mobile number already exists in the database
    const existingUser = await User.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    if (existingUser) {
      console.log("User account already exists");
      return res.status(409).json({
        message: "User account already exists. Please log in to your account",
      });
    }
    console.log("New Account!");
    res.status(200).json({ message: "New Account!" });
  } catch (error) {
    console.log("Registration Failed");
    console.log(error);
    res.status(500).json({ message: "Registration failed" });
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

const verifyOtpAndRegister = async (req, res) => {
  try {
    const { fullName, mobileNumber, email, password, verifiedOTP } = req.body;
    console.log("Req body of verify otp and register is ", req.body);
    // Verify the provided OTP (compare with the stored OTP, for example)
    // For demonstration, let's assume the verifiedOTP matches the stored OTP

    // ... your OTP verification logic ...

    // Now create the new user account
    const hashedPassword = await bcrypt.hash(password, 15);
    console.log("Hashed Password is ", hashedPassword);
    const user = new User({
      fullName,
      mobileNumber,
      email,
      password: hashedPassword,
    });
    await user.save();
    console.log("Account created successfully!");
    res.status(200).json({ message: "Registered successfully!" });
  } catch (error) {
    console.log("Registration Failed:", error);
    res.status(500).json({ message: "Registration Failed" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    console.log("Req body of verifyOtp is ", req.body);
    const { mobileNumber, otp } = req.body;
    const user = await User.findOne({ mobileNumber });
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
      SetOTPInactiveAfterFiveMinutes(otp, mobileNumber, 1500);
      return res
        .status(200)
        .json({ isVerified: true, message: "OTP Verified Successfully" });
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
};

const checkCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    // If the user is authenticated, send their details
    console.log("The user is Authenticated");
    res.json({ message: req.user });
  } else {
    // If the user is not authenticated, send an empty object or an appropriate response
    console.log("The user is not Authenticated");
    res.json({ message: "Unauthorized" });
  }
};

const sendOTP = async (req, res) => {
  try {
    console.log("Inside sendOTP route controller");
    const { mobileNumber } = req.body;
    console.log("Mobile Number from frontend is ", mobileNumber);
    const otp = GenerateSixDigitOTP();
    console.log("Generated OTP is ", otp);
    const user = await User.findOne({ mobileNumber });

    // Update the user's OTP field
    user.otp = otp;
    user.isOtpActive = true;
    await user.save();
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
  emailRegisterAuthentication,
  verifyOtpAndRegister,
  verifyOtp,
  logoutUser,
  checkCurrentUser,
  sendOTP,
  checkValidMobileNumber,
  updatePassword,
};
