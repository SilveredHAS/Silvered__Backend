const express = require("express");
const router = express.Router();
const {
  emailLoginAuthentication,
  emailRegisterAuthentication,
  verifyOtpAndRegister,
  logoutUser,
  checkCurrentUser,
  sendOTP,
} = require("../controllers/authController");

router.post("/auth/login", emailLoginAuthentication);
router.post("/auth/register", emailRegisterAuthentication);
router.post("/auth/send-otp", sendOTP);
router.post("/auth/verify-otp-and-register", verifyOtpAndRegister);
router.get("/logout", logoutUser);
router.get("/curr-user", checkCurrentUser);

module.exports = router;
