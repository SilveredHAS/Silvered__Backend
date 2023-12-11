const express = require("express");
const router = express.Router();
const {
  loginAuthentication,
  emailRegisterAuthentication,
  verifyOtp,
  verifyOtpAndRegister,
  logoutUser,
  checkCurrentUser,
  sendOTP,
  checkValidMobileNumber,
} = require("../controllers/authController");

router.post("/auth/login", loginAuthentication);
router.post("/auth/register", emailRegisterAuthentication);
router.post("/auth/verify-otp-and-register", verifyOtpAndRegister);
router.post("/auth/verify-otp", verifyOtp);
router.get("/logout", logoutUser);
router.post("/check-valid-mobile", checkValidMobileNumber);
router.post("/send-otp", sendOTP);
router.get("/curr-user", checkCurrentUser);

module.exports = router;
