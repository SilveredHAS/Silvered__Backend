const express = require("express");
const router = express.Router();
const {
  loginAuthentication,
  emailRegisterAuthentication,
  verifyOtpAndRegister,
  logoutUser,
  checkCurrentUser,
  sendOTP,
  checkValidMobileNumber,
} = require("../controllers/authController");

router.post("/auth/login", loginAuthentication);
router.post("/auth/register", emailRegisterAuthentication);
router.post("/auth/send-otp", sendOTP);
router.post("/auth/verify-otp-and-register", verifyOtpAndRegister);
router.get("/logout", logoutUser);
router.post("/check-valid-mobile", checkValidMobileNumber);
router.get("/curr-user", checkCurrentUser);

module.exports = router;
